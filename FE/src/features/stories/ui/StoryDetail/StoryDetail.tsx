'use client';

import { useAuth } from '@/features/login/model/auth.store';
import {
  checkStoryLikeStatus,
  getStoryById,
  STORIES_KEY,
} from '@/features/stories/api/stories.api';
import BackButton from '@/shared/ui/BackButton';
import MarkdownViewer from '@/shared/ui/MarkdownViewer';
import UserProfile from '@/shared/ui/UserProfile';
import extractDate from '@/shared/utils/extractDate';
import { Calendar, Eye } from 'lucide-react';
import Link from 'next/link';
import StorySidebar from './StorySidebar';
import { useRouter } from 'next/navigation';
import { useStoryViewCount } from '@/features/stories/model/useStoryViewCount';
import { useStoryLike } from '@/features/stories/model/useStoryLike';
import { useQuery } from '@tanstack/react-query';
import { toast } from '@/shared/utils/toast';
import SafeImage from '@/shared/ui/SafeImage/SafeImage';

interface StoryDetailProps {
  storyId: string;
}

const StoryDetail = ({ storyId }: StoryDetailProps) => {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useStoryViewCount(storyId);

  const { toggleLike } = useStoryLike(storyId);

  // 스토리 상세 데이터 구독
  const { data: story } = useQuery({
    queryKey: STORIES_KEY.detail(storyId),
    queryFn: async () => {
      const res = await getStoryById(storyId);
      return res.data; // ApiResponse 구조에 따라 .data 반환
    },
  });

  // 좋아요 상태 구독 (로그인 시에만)
  const { data: isLiked } = useQuery({
    queryKey: STORIES_KEY.likeStatus(storyId),
    queryFn: () => checkStoryLikeStatus(storyId),
    enabled: isAuthenticated, // 로그인 안돼있으면 쿼리 실행 안 함
    initialData: false,
  });

  if (!story) return null; // TODO: 스켈레톤

  const handleLikeClick = () => {
    if (!isAuthenticated) {
      const { pathname, search, hash } = window.location;
      const currentPath = `${pathname}${search}${hash}`;
      toast.warning('로그인이 필요한 기능입니다.');
      router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);
      return;
    }
    // 현재 상태를 넘겨주면 Hook이 반전시켜서 처리
    toggleLike(isLiked);
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-4">
      <div className="flex justify-center gap-16 -ml-20">
        <aside className="hidden lg:block">
          <div className="sticky top-24 h-fit mt-50">
            <StorySidebar
              isLiked={isLiked}
              likeCount={story.likeCount}
              onLikeClick={handleLikeClick}
              isAuthenticated={isAuthenticated}
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
                {story.viewCount}
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
          <div className="my-8 w-full relative h-108">
            <SafeImage
              src={story.thumbnailUrl}
              alt={`${story.title} 글의 썸네일 이미지`}
              fill
              className="object-cover"
              priority={true}
            />
          </div>

          <MarkdownViewer content={story.contents} />
        </article>
      </div>

      {/* 모바일용 하단 고정 사이드바 */}
      <div className="lg:hidden fixed bottom-6 right-6 z-50 drop-shadow-lg">
        <StorySidebar
          isLiked={isLiked}
          likeCount={story.likeCount}
          onLikeClick={handleLikeClick}
          isAuthenticated={isAuthenticated}
        />
      </div>
    </div>
  );
};

export default StoryDetail;
