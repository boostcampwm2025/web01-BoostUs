'use client';

import Image from 'next/image';
import { Calendar1, Eye, Heart } from 'lucide-react';
import {
  fetchRecoStory,
  RECO_STORY_PARAMS,
  RECO_STORY_QUERY_KEY,
} from '@/features/main/reco/api/fetchRecoStory';
import UserProfile from '@/shared/ui/UserProfile';
import extractDate from '@/shared/utils/extractDate';
import { Card } from '@/shared/ui/Card';
import { useQuery } from '@tanstack/react-query';
import useImageError from '@/shared/model/useImageError';

const DEFAULT_THUMBNAIL = '/assets/NoImage.png';

const RecommendStorySection = () => {
  const {
    data: response,
    isLoading,
    isError,
  } = useQuery({
    queryKey: RECO_STORY_QUERY_KEY,
    queryFn: () => fetchRecoStory(RECO_STORY_PARAMS),
    staleTime: 1000 * 60 * 5,
  });

  const bestStory = response?.data?.items?.[0] ?? null;
  const { isError: imageError, setIsError: setImageError } = useImageError(
    bestStory?.thumbnailUrl
  );

  if (isLoading) {
    return (
      <div className="w-full h-full bg-neutral-surface-bold animate-pulse rounded-2xl border border-neutral-border-default min-h-50" />
    );
  }

  if (isError || !bestStory) {
    return null; // TODO: 에러 UI 개선 필요
  }

  const currentSrc = imageError
    ? DEFAULT_THUMBNAIL
    : (bestStory.thumbnailUrl ?? DEFAULT_THUMBNAIL);

  return (
    <Card.Root
      href={`/stories/${bestStory.id}`}
      className="grid w-full h-125 grid-rows-[4fr_6fr]"
    >
      <Card.ImageContainer className="h-full min-h-50">
        <Image
          src={currentSrc}
          alt={`${bestStory.title} 글의 썸네일 이미지`}
          fill
          className="object-cover"
          priority
          onError={() => setImageError(true)}
        />
      </Card.ImageContainer>

      <Card.Content className="px-3 py-2 justify-between h-full">
        <div>
          <UserProfile
            imageSrc={bestStory.member.avatarUrl}
            nickname={bestStory.member.nickname}
            cohort={bestStory.member.cohort}
          />
          <Card.Title className="mt-4 text-display-20">
            {bestStory.title}
          </Card.Title>
          <Card.Description className="mt-2 mb-2 leading-6 line-clamp-3">
            {bestStory.summary}
          </Card.Description>
        </div>

        <Card.Footer className="mt-3">
          <div className="flex flex-row items-center gap-1">
            <Heart className="text-neutral-text-weak h-3 w-3" />
            <span className="text-body-12 text-neutral-text-weak">
              {bestStory.likeCount}
            </span>
          </div>
          <div className="flex flex-row items-center gap-1">
            <Eye className="text-neutral-text-weak h-3 w-3" />
            <span className="text-body-12 text-neutral-text-weak">
              {bestStory.viewCount}
            </span>
          </div>
          <div className="flex flex-row items-center gap-1">
            <Calendar1 className="text-neutral-text-weak h-3 w-3" />
            <span className="text-body-12 text-neutral-text-weak">
              {extractDate(bestStory.createdAt)}
            </span>
          </div>
        </Card.Footer>
      </Card.Content>
    </Card.Root>
  );
};

export default RecommendStorySection;
