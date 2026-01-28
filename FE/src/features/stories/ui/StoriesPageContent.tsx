'use client';

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { createOrUpdateFeed, getMyFeed } from '@/features/feed/api/feed.api';
import {
  convertBlogUrlToRss,
  detectPlatformFromBlogUrl,
  extractBlogUrlFromRss,
} from '@/features/feed/utils/blog-rss-converter';
import { StoriesProvider, useStoriesContext } from '@/features/stories/model';
import { Story } from '@/features/stories/model/stories.type';
import useRankingButtonVisibility from '@/features/stories/model/useRankingButtonVisibility';
import StoriesList from '@/features/stories/ui/List/List';
import StoriesListDropdown from '@/features/stories/ui/ListDropdown/Dropdown';
import StoriesSearchBar from '@/features/stories/ui/SearchBar/SearchBar';
import StoriesRanking from '@/features/stories/ui/StoriesRanking/Ranking';
import CustomDialog from '@/shared/ui/Dialog/CustomDialog';
import PageHeader from '@/shared/ui/PageHeader';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'lucide-react';
import { useEffect, useState } from 'react';

interface StoriesPageContentProps {
  initialStories: Story[];
}

const StoriesLayout = ({ initialStories }: StoriesPageContentProps) => {
  const { isRankingOpen, toggleRanking } = useStoriesContext();

  const isRankingButtonHidden = useRankingButtonVisibility(isRankingOpen);

  const [blogUrl, setBlogUrl] = useState('');
  const [rssUrl, setRssUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [conversionError, setConversionError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchMyFeed = async () => {
      setIsLoading(true);
      setServerError(null);

      try {
        const response = await getMyFeed();
        const feed = response.data;

        if (!isMounted || !feed) return;

        // RSS URL에서 블로그 URL 추출
        const extractedBlogUrl = extractBlogUrlFromRss(feed.feedUrl);

        if (extractedBlogUrl) {
          setBlogUrl(extractedBlogUrl);
          setRssUrl(feed.feedUrl);
        } else {
          // 자동 감지 실패 시 그대로 RSS URL 사용
          setBlogUrl(feed.feedUrl);
          setRssUrl(feed.feedUrl);
        }
      } catch {
        if (!isMounted) return;
        // 비로그인 또는 에러 상황은 여기서는 조용히 처리하고, 다이얼로그 내에서만 메시지를 보여줍니다.
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void fetchMyFeed();

    return () => {
      isMounted = false;
    };
  }, []);

  // 블로그 URL 변경 시 RSS URL 자동 변환 (플랫폼 자동 감지)
  useEffect(() => {
    if (!blogUrl) {
      setRssUrl('');
      setConversionError(null);
      return;
    }

    // URL로부터 플랫폼 자동 감지
    const autoPlatform = detectPlatformFromBlogUrl(blogUrl);

    if (!autoPlatform || autoPlatform === 'custom') {
      // 감지 실패 or 지원하지 않는 경우 → 그대로 사용 (직접 RSS 입력 시나리오)
      setRssUrl(blogUrl);
      setConversionError(null);
      return;
    }

    try {
      const convertedRss = convertBlogUrlToRss(autoPlatform, blogUrl);
      setRssUrl(convertedRss);
      setConversionError(null);
    } catch (error) {
      setConversionError(
        error instanceof Error ? error.message : 'URL 변환에 실패했습니다.'
      );
      setRssUrl('');
    }
  }, [blogUrl]);

  const handleSubmitRss = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsSubmitting(true);
    setServerError(null);
    setSuccessMessage(null);
    setConversionError(null);

    if (!blogUrl) {
      setServerError('블로그 주소를 입력해주세요.');
      setIsSubmitting(false);
      return;
    }

    // 블로그 주소로 플랫폼 자동 감지
    const autoPlatform = detectPlatformFromBlogUrl(blogUrl);
    let finalRssUrl = rssUrl || blogUrl;

    if (autoPlatform && autoPlatform !== 'custom') {
      try {
        finalRssUrl = convertBlogUrlToRss(autoPlatform, blogUrl);
      } catch (error) {
        setConversionError(
          error instanceof Error ? error.message : 'URL 변환에 실패했습니다.'
        );
        setIsSubmitting(false);
        return;
      }
    }

    if (!finalRssUrl) {
      setServerError('RSS URL을 생성하지 못했어요. 주소를 다시 확인해 주세요.');
      setIsSubmitting(false);
      return;
    }

    try {
      await createOrUpdateFeed({ feedUrl: finalRssUrl });
      setSuccessMessage('RSS URL이 등록/수정되었어요.');
    } catch {
      setServerError(
        'RSS URL 등록에 실패했어요. 로그인 상태와 주소를 확인해 주세요.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex w-full max-w-7xl flex-col font-sans">
      <PageHeader
        title="캠퍼들의 이야기"
        subtitle="캠퍼들의 기술, 경험, 회고, 면접 팁 등의 이야기"
      />
      <motion.div
        layout
        className={`mt-8 grid items-start gap-8 ${isRankingOpen ? 'grid-cols-[7fr_3fr]' : 'grid-cols-1'}`}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <motion.div layout className="gap-10 flex flex-col">
          <div className="flex flex-row items-center gap-4">
            <StoriesSearchBar />
            <StoriesListDropdown />
            <Tooltip>
              <CustomDialog
                dialogTrigger={
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      className="text-neutral-text-weak hover:text-brand-surface-default transition-colors duration-150 cursor-pointer"
                    >
                      <Link />
                    </button>
                  </TooltipTrigger>
                }
                dialogTitle="내 블로그 등록하기"
                dialogDescription="내 블로그를 등록하면 캠퍼들의 이야기에 내 글을 게시할 수 있어요."
                dialogContent={
                  <div className="mt-4 flex flex-col gap-4">
                    {/* 블로그 주소 */}
                    <div className="flex flex-col gap-2">
                      <label
                        htmlFor="blog-url"
                        className="text-body-14 font-medium text-neutral-text-default"
                      >
                        블로그 주소
                      </label>
                      <input
                        id="blog-url"
                        type="text"
                        value={blogUrl}
                        onChange={(e) => setBlogUrl(e.target.value)}
                        placeholder="https://myblog.tistory.com 또는 https://velog.io/@myblog"
                        className="w-full border border-neutral-border-default placeholder:text-neutral-text-weak text-body-16 text-neutral-text-default px-4 py-2 rounded-lg focus:outline-none focus:ring focus:border-brand-surface-default disabled:bg-neutral-50 disabled:text-neutral-400"
                        disabled={isLoading || isSubmitting}
                      />
                    </div>

                    {/* 변환된 RSS URL 미리보기 (선택적) */}
                    {blogUrl && !conversionError && rssUrl && (
                      <p className="text-body-12 text-neutral-text-weak">
                        변환된 RSS: {rssUrl}
                      </p>
                    )}

                    {conversionError && (
                      <p className="mt-1 text-body-12 text-red-500">
                        {conversionError}
                      </p>
                    )}
                    {serverError && (
                      <p className="mt-1 text-body-12 text-red-500">
                        {serverError}
                      </p>
                    )}
                    {successMessage && (
                      <p className="mt-1 text-body-12 text-emerald-600">
                        {successMessage}
                      </p>
                    )}
                  </div>
                }
                onSubmit={handleSubmitRss}
              />
              <TooltipContent className={'bg-brand-surface-default'}>
                <p className="text-body-12 text-brand-text-on-default">
                  내 블로그 등록하기
                </p>
              </TooltipContent>
            </Tooltip>
          </div>
          <StoriesList initialStories={initialStories} />
        </motion.div>
        <AnimatePresence mode="popLayout">
          {isRankingOpen && <StoriesRanking initialStories={initialStories} />}
        </AnimatePresence>
      </motion.div>
      <AnimatePresence>
        {!isRankingOpen && !isRankingButtonHidden && (
          <motion.button
            key="ranking-toggle-btn"
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 100, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleRanking}
            className="fixed right-0 top-30 w-10 h-20 bg-brand-surface-default hover:opacity-90 active:opacity-80 transition-opacity duration-150 cursor-pointer rounded-l-xl flex items-center justify-center font-sans text-sm z-50"
          >
            <span className="text-brand-text-on-default text-display-16 [writing-mode:vertical-rl] [text-orientation:upright]">
              랭킹
            </span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

const StoriesPageContent = ({ initialStories }: StoriesPageContentProps) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            staleTime: 60 * 1000,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <StoriesProvider>
        <StoriesLayout initialStories={initialStories} />
      </StoriesProvider>
    </QueryClientProvider>
  );
};

export default StoriesPageContent;
