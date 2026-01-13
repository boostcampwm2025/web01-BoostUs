import Image from 'next/image';
import { Eye, Heart } from 'lucide-react';
import { StoriesCardProps } from '@/features/stories/model/types';

const StoriesCard = ({ story }: StoriesCardProps) => {
  return (
    <div className="w-full bg-neutral-surface-bold rounded-2xl border border-neutral-border-default transition-shadow duration-150 cursor-pointer hover:shadow-default grid grid-rows-[4fr_6fr] overflow-hidden">
      <div className="relative w-full">
        <Image
          src={story.thumbnailUrl}
          alt={`${story.title} 글의 썸네일 이미지`}
          fill
          className="object-cover"
          priority
        />
      </div>
      <div className="px-3 py-2">
        <div className="flex flex-row items-center justify-start gap-2">
          <div className="w-8 h-8 rounded-full bg-grayscale-300" />
          <div className="flex flex-col">
            <span className="text-body-14 text-neutral-text-default">
              {story.member.nickname}
            </span>
            <span className="text-body-12 text-neutral-text-weak">
              {story.member.cohort}기
            </span>
          </div>
        </div>
        <h3 className="mt-4 text-neutral-text-strong text-display-20 line-clamp-1">
          {story.title}
        </h3>
        <div className="mt-2 mb-2 h-18 text-body-14 leading-6 text-neutral-text-weak">
          <p className="line-clamp-3">{story.summary}</p>
        </div>
        <div className="flex flex-row items-center justify-between w-full mt-3">
          <div className="flex flex-row items-center gap-2">
            <div className="flex flex-row items-center gap-1">
              <Heart className="w-3 h-3 text-neutral-text-weak" />
              <span className="text-body-12 text-neutral-text-weak">
                {story.likeCount}
              </span>
            </div>
            <div className="flex flex-row items-center gap-1">
              <Eye className="w-3 h-3 text-neutral-text-weak" />
              <span className="text-body-12 text-neutral-text-weak">
                {story.viewCount}
              </span>
            </div>
          </div>
          <span className="text-body-12 text-neutral-text-weak">
            {story.createdAt.slice(0, 10)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default StoriesCard;
