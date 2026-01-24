'use client';

import Image from 'next/image';
import { Eye, Heart } from 'lucide-react';
import Link from 'next/link';
import type { Story } from '@/features/stories/model/stories.type';
import useImageError from '@/shared/model/useImageError';
import UserProfile from '@/shared/ui/UserProfile';
import extractDate from '@/shared/utils/extractDate';

interface StoriesCardProps {
  id: string;
  story: Story;
}

const DEFAULT_THUMBNAIL = '/FE/public/assets/NoImage.png';

const StoriesCard = ({ id, story }: StoriesCardProps) => {
  const { isError, setIsError } = useImageError();

  const currentSrc = isError
    ? DEFAULT_THUMBNAIL
    : (story.thumbnailUrl ?? DEFAULT_THUMBNAIL);

  return (
    <Link href={`/stories/${id}`}>
      <div className="bg-neutral-surface-bold border-neutral-border-default hover:shadow-default grid w-full cursor-pointer grid-rows-[4fr_6fr] overflow-hidden rounded-2xl border transition-shadow duration-150">
        <div className="relative w-full">
          <Image
            src={currentSrc}
            alt={`${story.title} 글의 썸네일 이미지`}
            fill
            className="object-cover"
            priority
            onError={() => setIsError(true)}
          />
        </div>
        <div className="px-3 py-2">
          <UserProfile
            imageSrc={story.member.avatarUrl}
            nickname={story.member.nickname}
            cohort={story.member.cohort}
          />
          <h3 className="text-neutral-text-strong text-display-16 mt-4 line-clamp-1">
            {story.title}
          </h3>
          <div className="text-body-14 text-neutral-text-weak mt-2 mb-2 h-18 leading-6">
            <p className="line-clamp-3">{story.summary}</p>
          </div>
          <div className="mt-3 flex w-full flex-row items-center justify-between">
            <div className="flex flex-row items-center gap-2">
              <div className="flex flex-row items-center gap-1">
                <Heart className="text-neutral-text-weak h-3 w-3" />
                <span className="text-body-12 text-neutral-text-weak">
                  {story.likeCount}
                </span>
              </div>
              <div className="flex flex-row items-center gap-1">
                <Eye className="text-neutral-text-weak h-3 w-3" />
                <span className="text-body-12 text-neutral-text-weak">
                  {story.viewCount}
                </span>
              </div>
            </div>
            <span className="text-body-12 text-neutral-text-weak">
              {extractDate(story.createdAt)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default StoriesCard;
