'use client';

import Image from 'next/image';
import { Calendar1, Eye, Heart } from 'lucide-react';
import { useEffect, useState } from 'react';
import { fetchRecoStory } from '@/features/main/reco/api/fetchRecoStory';
import { Story } from '@/features/stories';
import UserProfile from '@/shared/ui/UserProfile';
import extractDate from '@/shared/utils/extractDate';
import { Card } from '@/shared/ui/Card';

const DEFAULT_THUMBNAIL = '/FE/public/assets/NoImage.png';

const RecommendStorySection = () => {
  // 1. 내부에서 사용할 State 정의
  const [bestStory, setBestStory] = useState<Story | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isImageError, setIsImageError] = useState(false);

  // 2. 컴포넌트 마운트 시 데이터 Fetching
  useEffect(() => {
    const loadBestStory = async () => {
      try {
        setIsLoading(true);
        // 메인용 임시 로직: 조회수(VIEWS) 1등 가져오기
        const response = await fetchRecoStory({
          sortBy: 'views',
          period: 'all',
          size: 1,
        });

        if (response?.data?.items && response.data.items.length > 0) {
          setBestStory(response.data.items[0]);
        }
      } catch (error) {
        console.error('추천 스토리 로딩 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };

    void loadBestStory();
  }, []);

  // 3. 로딩 중일 때 처리 (스켈레톤 혹은 빈 화면)
  if (isLoading) {
    return (
      <div className="w-full h-full bg-neutral-surface-bold animate-pulse rounded-2xl border border-neutral-border-default min-h-50" />
    );
  }

  // 4. 데이터가 없을 때 처리
  if (!bestStory) {
    return null;
  }

  // 5. 이미지 URL 처리 로직
  const currentSrc = isImageError
    ? DEFAULT_THUMBNAIL
    : (bestStory.thumbnailUrl ?? DEFAULT_THUMBNAIL);

  // 6. 렌더링 (Props 대신 bestStory State 사용)
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
          onError={() => setIsImageError(true)}
        />
      </Card.ImageContainer>

      <Card.Content className="px-3 py-2 justify-between h-full">
        <div>
          <UserProfile
            imageSrc={bestStory.member.avatarUrl}
            nickname={bestStory.member.nickname}
            cohort={bestStory.member.cohort}
          />
          {/* [Typography] text-display-20으로 오버라이드 */}
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
