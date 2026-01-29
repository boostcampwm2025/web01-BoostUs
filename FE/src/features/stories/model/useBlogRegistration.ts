'use client';

import { useState, useEffect, FormEvent } from 'react';
import { createOrUpdateFeed, getMyFeed } from '@/features/feed/api/feed.api';
import {
  convertBlogUrlToRss,
  detectPlatformFromBlogUrl,
  extractBlogUrlFromRss,
} from '@/features/feed/utils/blog-rss-converter';
import { useAuth } from '@/features/login/model/auth.store';

export const useBlogRegistration = () => {
  const { member } = useAuth();

  // 상태 관리
  const [blogUrl, setBlogUrl] = useState('');
  const [rssUrl, setRssUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 에러 및 메시지 상태
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [conversionError, setConversionError] = useState<string | null>(null);

  // 파생 상태
  const hasRssFeed = !!rssUrl;
  const hasError = !!conversionError || !!serverError;

  // 1. 내 피드 정보 가져오기
  useEffect(() => {
    if (!member) return;

    let isMounted = true;
    const fetchMyFeed = async () => {
      setIsLoading(true);
      setServerError(null);
      try {
        const response = await getMyFeed();
        const feed = response.data;
        if (!isMounted || !feed) return;

        const extractedBlogUrl = extractBlogUrlFromRss(feed.feedUrl);
        setBlogUrl(extractedBlogUrl ?? feed.feedUrl);
        setRssUrl(feed.feedUrl);
      } catch {
        // 조용한 실패 처리 (기존 로직 유지)
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    void fetchMyFeed();
    return () => {
      isMounted = false;
    };
  }, [member]);

  // 2. URL 변경 시 플랫폼 감지 및 RSS 변환
  useEffect(() => {
    if (!blogUrl) {
      setRssUrl('');
      setConversionError(null);
      return;
    }

    const autoPlatform = detectPlatformFromBlogUrl(blogUrl);

    // 커스텀이거나 감지되지 않은 경우 입력값을 그대로 RSS로 가정 (혹은 추후 처리)
    if (!autoPlatform || autoPlatform === 'custom') {
      setRssUrl(blogUrl);
      setConversionError(null);
      return;
    }

    try {
      setRssUrl(convertBlogUrlToRss(autoPlatform, blogUrl));
      setConversionError(null);
    } catch (error) {
      setConversionError(
        error instanceof Error ? error.message : 'URL 변환 실패'
      );
      setRssUrl('');
    }
  }, [blogUrl]);

  // 3. 폼 제출 핸들러
  const handleSubmitRss = async (event?: FormEvent) => {
    if (event) event.preventDefault();

    setIsSubmitting(true);
    setServerError(null);
    setSuccessMessage(null);

    if (!blogUrl.trim()) {
      setServerError('블로그 주소를 입력해주세요.');
      setIsSubmitting(false);
      return;
    }

    // 최종 RSS URL 결정 로직
    const autoPlatform = detectPlatformFromBlogUrl(blogUrl);
    let finalRssUrl = rssUrl || blogUrl;

    if (autoPlatform && autoPlatform !== 'custom') {
      try {
        finalRssUrl = convertBlogUrlToRss(autoPlatform, blogUrl);
      } catch {
        // 변환 실패 시 이미 useEffect에서 에러가 잡혔을 것임
        setIsSubmitting(false);
        return;
      }
    }

    try {
      await createOrUpdateFeed({ feedUrl: finalRssUrl });
      setSuccessMessage('RSS URL이 등록/수정되었어요.');
    } catch {
      setServerError('등록 실패. 주소를 확인해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    member,
    formState: {
      blogUrl,
      setBlogUrl,
      rssUrl,
    },
    status: {
      isLoading,
      isSubmitting,
      hasRssFeed,
      hasError,
    },
    messages: {
      serverError,
      successMessage,
      conversionError,
    },
    handlers: {
      handleSubmitRss,
    },
  };
};
