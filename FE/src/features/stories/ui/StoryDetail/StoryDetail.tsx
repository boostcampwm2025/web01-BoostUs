'use client';

import { useAuth } from '@/features/login/model/auth.store';
import {
  checkStoryLikeStatus,
  incrementStoryView,
} from '@/features/stories/api/stories.api';
import type { StoryDetail } from '@/features/stories/model/stories.type';
import BackButton from '@/shared/ui/BackButton';
import MarkdownViewer from '@/shared/ui/MarkdownViewer';
import UserProfile from '@/shared/ui/UserProfile';
import extractDate from '@/shared/utils/extractDate';
import { Calendar, Eye } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import StorySidebar from './StorySidebar';
import { toast } from '@/shared/utils/toast';

const StoryDetail = ({ story }: { story: StoryDetail }) => {
  const { isAuthenticated } = useAuth();
  const [likeCount, setLikeCount] = useState(story.likeCount);
  const [isLiked, setIsLiked] = useState(false);
  const [viewCount, setViewCount] = useState(story.viewCount);

  // story prop이 변경될 때 상태 업데이트
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLikeCount(story.likeCount);
    setIsLiked(false);
    setViewCount(story.viewCount);
  }, [story.id, story.likeCount, story.viewCount]);

  // 스토리 상세 진입 시 조회수 증가 (bid 쿠키로 중복 방지)
  useEffect(() => {
    const incrementView = async () => {
      try {
        await incrementStoryView(story.id);
        setViewCount((prev) => prev + 1);
      } catch (error) {
        toast.error(error);
      }
    };
    void incrementView();
  }, [story.id]);

  // 클라이언트 사이드에서 좋아요 상태 확인
  useEffect(() => {
    const fetchLikeStatus = async () => {
      // 로그인 상태일 때만 API 호출
      if (isAuthenticated) {
        try {
          const liked = await checkStoryLikeStatus(story.id);
          setIsLiked(liked);
        } catch (error) {
          // 에러 발생 시 초기값 유지 (로그인하지 않은 상태로 처리)
          toast.error(error);
          setIsLiked(false);
        }
      } else {
        // 로그인하지 않은 경우 false로 설정
        setIsLiked(false);
      }
    };

    void fetchLikeStatus();
  }, [story.id, isAuthenticated]);

  const handleLikeChange = (newIsLiked: boolean, newLikeCount: number) => {
    setIsLiked(newIsLiked);
    setLikeCount(newLikeCount);
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-4">
      <div className="flex justify-center gap-16 -ml-20">
        {/* 좌측 사이드바 */}
        <aside className="hidden lg:block">
          <div className="sticky top-24 h-fit mt-50">
            <StorySidebar
              storyId={story.id}
              initialIsLiked={isLiked}
              initialLikeCount={likeCount}
              onLikeChange={handleLikeChange}
            />
          </div>
        </aside>

        {/* 우측 콘텐츠 영역 */}
        <article className="w-full max-w-3xl flex flex-col items-start justify-center">
          <BackButton url="/stories" />
          <h1 className="text-neutral-text-strong text-display-32 w-full mt-4 leading-tight wrap-break-word">
            {story.title}
          </h1>
          <UserProfile
            imageSrc={story.member.avatarUrl}
            nickname={story.member.nickname}
            cohort={story.member.cohort}
          />
          <div className="mt-3 flex flex-row items-center justify-center gap-2 flex-wrap">
            <div className="flex flex-row items-center gap-1">
              <Eye className="text-neutral-text-weak h-3 w-3" />
              <span className="text-body-12 text-neutral-text-weak">
                {viewCount}
              </span>
            </div>
            <div className="flex flex-row items-center gap-1">
              <Calendar className="text-neutral-text-weak h-3 w-3" />
              <span className="text-body-12 text-neutral-text-weak">
                {extractDate(story.createdAt)}
              </span>
            </div>
            <Link
              href={story.originalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center"
            >
              <span className="text-body-12 text-neutral-text-weak hover:underline">
                원문 보기
              </span>
            </Link>
          </div>
          <div className="my-8 w-full">
            <Image
              src={story.thumbnailUrl}
              alt={`${story.title} 글의 썸네일 이미지`}
              width={768}
              height={432}
              className="w-full object-cover"
              priority
            />
          </div>

          <MarkdownViewer content={story.contents} />
        </article>
      </div>

      {/* 모바일용 하단 고정 사이드바 */}
      <div className="lg:hidden fixed bottom-6 right-6 z-50 drop-shadow-lg">
        <StorySidebar
          storyId={story.id}
          initialIsLiked={isLiked}
          initialLikeCount={likeCount}
          onLikeChange={handleLikeChange}
        />
      </div>
    </div>
  );
};

export default StoryDetail;
