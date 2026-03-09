import { Calendar1, Eye, Heart } from 'lucide-react';
import UserProfile from '@/shared/ui/UserProfile';
import extractDate from '@/shared/utils/extractDate';
import { Card } from '@/shared/ui/Card';
import SafeImage from '@/shared/ui/SafeImage/SafeImage';
import type { Story } from '@/features/stories/model/stories.type';

const RecommendStorySection = ({ story }: { story: Story | null }) => {
  if (!story) {
    return null; // TODO: 에러 UI 개선 필요
  }

  return (
    <Card.Root
      href={`/stories/${story.id}`}
      className="grid w-full h-125 grid-rows-[4fr_6fr]"
    >
      <Card.ImageContainer className="h-full min-h-50">
        <SafeImage
          src={story.thumbnailUrl}
          alt={`${story.title} 글의 썸네일 이미지`}
          fill
          className="object-cover"
          priority
        />
      </Card.ImageContainer>

      <Card.Content className="px-3 py-2 justify-between h-full">
        <div>
          <UserProfile
            imageSrc={story.member.avatarUrl}
            nickname={story.member.nickname}
            cohort={story.member.cohort}
          />
          <Card.Title className="mt-4 text-display-20">
            {story.title}
          </Card.Title>
          <Card.Description className="mt-2 mb-2 leading-6 line-clamp-3">
            {story.summary}
          </Card.Description>
        </div>

        <Card.Footer className="mt-3">
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
            <Calendar1 className="text-neutral-text-weak h-3 w-3" />
            <span className="text-body-12 text-neutral-text-weak">
              {extractDate(story.createdAt)}
            </span>
          </div>
        </Card.Footer>
      </Card.Content>
    </Card.Root>
  );
};

export default RecommendStorySection;
