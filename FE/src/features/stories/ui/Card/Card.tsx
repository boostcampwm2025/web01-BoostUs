'use client';

import Image from 'next/image';
import { Calendar1, Eye, Heart } from 'lucide-react';
import type { Story } from '@/features/stories/model/stories.type';
import useImageError from '@/shared/model/useImageError';
import UserProfile from '@/shared/ui/UserProfile';
import extractDate from '@/shared/utils/extractDate';
import { Card } from '@/shared/ui/Card';

interface StoriesCardProps {
  id: string;
  story: Story;
}

const DEFAULT_THUMBNAIL = '/assets/NoImage.png';

const StoriesCard = ({ id, story }: StoriesCardProps) => {
  const { isError, setIsError } = useImageError(story.thumbnailUrl);

  const currentSrc = isError
    ? DEFAULT_THUMBNAIL
    : (story.thumbnailUrl ?? DEFAULT_THUMBNAIL);

  return (
    <Card.Root
      href={`/stories/${id}`}
      className="grid w-full grid-rows-[4fr_6fr]"
    >
      <Card.ImageContainer>
        <Image
          src={currentSrc}
          alt={`${story.title} 글의 썸네일 이미지`}
          fill
          className="object-cover"
          priority
          onError={() => setIsError(true)}
        />
      </Card.ImageContainer>
      <Card.Content className="px-3 py-2 justify-between">
        <div>
          <UserProfile
            imageSrc={story.member.avatarUrl}
            nickname={story.member.nickname}
            cohort={story.member.cohort}
          />
          <Card.Title className="mt-4">{story.title}</Card.Title>
          <Card.Description className="mt-2 mb-2 leading-6 line-clamp-3">
            {story.summary}
          </Card.Description>
        </div>
        <Card.Footer className="mt-3">
          <Card.InfoItem icon={Heart}>{story.likeCount}</Card.InfoItem>
          <Card.InfoItem icon={Eye}>{story.viewCount}</Card.InfoItem>
          <Card.InfoItem icon={Calendar1}>
            {extractDate(story.createdAt)}
          </Card.InfoItem>
        </Card.Footer>
      </Card.Content>
    </Card.Root>
  );
};

export default StoriesCard;
