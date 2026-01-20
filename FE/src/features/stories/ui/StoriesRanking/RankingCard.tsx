import { Eye, Heart } from 'lucide-react';
import { Story } from '@/features/stories/model/stories.type';
import Link from 'next/link';

interface StoriesRankingCardProps {
  story: Story;
  hasBorder: boolean;
}

const StoriesRankingCard = ({ story, hasBorder }: StoriesRankingCardProps) => {
  return (
    <Link href={`/stories/${story.id}`}>
      <div className="flex flex-col">
        <div
          className={`flex flex-col px-3 py-2 ${
            hasBorder ? 'border-neutral-border-default border-b' : ''
          }`}
        >
          <h3 className="text-display-20 text-neutral-text-strong line-clamp-1">
            {story.title}
          </h3>
          <p className="text-body-14 text-neutral-text-weak mt-0.5 line-clamp-1 w-full">
            {story.summary}
          </p>
          <div className="mt-3 flex w-full flex-row items-center justify-end gap-2">
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
        </div>
      </div>
    </Link>
  );
};

export default StoriesRankingCard;
