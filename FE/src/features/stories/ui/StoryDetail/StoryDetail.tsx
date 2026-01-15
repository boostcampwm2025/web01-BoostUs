import type { StoryDetail } from '@/features/stories/model/stories.type';
import { Calendar, Eye, Heart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const StoryDetail = ({ story }: { story: StoryDetail }) => {
  return (
    <article className="mx-auto flex w-full max-w-3xl flex-col items-start justify-center">
      <h1 className="text-neutral-text-strong text-display-32 w-full leading-tight break-all">
        {story.title}
      </h1>
      <div className="mt-4 flex flex-row items-center gap-2">
        <div className="flex flex-row items-center justify-start gap-2">
          <div className="bg-grayscale-300 h-8 w-8 rounded-full" />
          <div className="flex flex-col">
            <span className="text-body-14 text-neutral-text-default">
              {story.member.nickname}
            </span>
            <span className="text-body-12 text-neutral-text-weak">
              {story.member.cohort}기
            </span>
          </div>
        </div>
      </div>
      <div className="mt-3 flex flex-row items-center justify-center gap-2">
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
        <div className="flex flex-row items-center gap-1">
          <Calendar className="text-neutral-text-weak h-3 w-3" />
          <span className="text-body-12 text-neutral-text-weak">
            {story.createdAt.slice(0, 10)}
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
      <div className="mt-8 w-full">
        <Image
          src={story.thumbnailUrl}
          alt={`${story.title} 글의 썸네일 이미지`}
          width={768}
          height={432}
          className="w-full rounded-lg object-cover"
          priority
        />
      </div>
    </article>
  );
};

export default StoryDetail;
