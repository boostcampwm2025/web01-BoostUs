'use client';

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

const StoryDetail = ({ story }: { story: StoryDetail }) => {
  const [likeCount, setLikeCount] = useState(story.likeCount);
  const [isLiked, setIsLiked] = useState(story.isLikedByMe);

  console.log(isLiked, likeCount);

  // story prop이 변경될 때 상태 업데이트
  useEffect(() => {
    setIsLiked(story.isLikedByMe);
    setLikeCount(story.likeCount);
  }, [story.isLikedByMe, story.likeCount]);

  const handleLikeChange = (newIsLiked: boolean, newLikeCount: number) => {
    setIsLiked(newIsLiked);
    setLikeCount(newLikeCount);
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-4">
      <div className="flex justify-center gap-16 -ml-20">
        {/* 좌측 사이드바 */}
        <aside className="hidden lg:block">
          <div className="sticky top-24 h-fit mt-[200px]">
            <StorySidebar
              storyId={story.id}
              initialIsLiked={isLiked}
              initialLikeCount={likeCount}
              onLikeChange={handleLikeChange}
            />
          </div>
        </aside>

        {/* 우측 콘텐츠 영역 */}
        <article className="w-full max-w-2xl flex flex-col items-start justify-center">
          <BackButton />
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
          <div className="w-full wrap-break-word overflow-x-hidden **:max-w-full **:wrap-break-word [&_pre]:overflow-x-auto [&_code]:wrap-break-word">
            <MarkdownViewer content={story.contents} />
          </div>
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
