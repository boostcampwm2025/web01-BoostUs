import type { StoryDetail } from '@/features/stories/model/stories.type';
import BackButton from '@/shared/ui/BackButton';
import MarkdownViewer from '@/shared/ui/MarkdownViewer';
import { Calendar, Eye, Heart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import UserProfile from '@/shared/ui/UserProfile';

const StoryDetail = ({ story }: { story: StoryDetail }) => {
  return (
    <article className="mx-auto flex w-full max-w-3xl flex-col items-start justify-center">
      <BackButton />
      <h1 className="text-neutral-text-strong text-display-32 w-full mt-4 leading-tight break-all">
        {story.title}
      </h1>
      <UserProfile
        imageSrc={story.member.avatarUrl}
        nickname={story.member.nickname}
        cohort={story.member.cohort}
      />
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
  );
};

export default StoryDetail;
