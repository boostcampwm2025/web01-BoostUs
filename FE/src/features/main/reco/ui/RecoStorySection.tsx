'use client';

import Image from 'next/image';
import { Calendar1, Eye, Heart } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { fetchRecoStory } from '@/features/main/reco/api/fetchRecoStory';
import { Story } from '@/features/stories';
import UserProfile from '@/shared/ui/UserProfile';
import extractDate from '@/shared/utils/extractDate';

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
    <Link href={`/stories/${bestStory.id}`}>
      <div className="bg-neutral-surface-bold border-neutral-border-default hover:border-neutral-border-active shadow-default hover:shadow-hover grid w-full cursor-pointer grid-rows-[4fr_6fr] overflow-hidden rounded-2xl border transition-colors duration-150 h-full">
        {/* 상단 이미지 영역 */}
        <div className="relative w-full h-full min-h-50">
          <Image
            src={currentSrc}
            alt={`${bestStory.title} 글의 썸네일 이미지`}
            fill
            className="object-cover"
            priority
            onError={() => setIsImageError(true)}
          />
        </div>

        {/* 하단 텍스트 정보 영역 */}
        <div className="px-3 py-2 flex flex-col justify-between h-full">
          <div>
            <UserProfile
              imageSrc={bestStory.member.avatarUrl}
              nickname={bestStory.member.nickname}
              cohort={bestStory.member.cohort}
            />
            <h3 className="text-neutral-text-strong text-display-20 mt-4 line-clamp-1">
              {bestStory.title}
            </h3>
            <div className="text-body-14 text-neutral-text-weak mt-2 mb-2 leading-6">
              <p className="line-clamp-3">{bestStory.summary}</p>
            </div>
          </div>

          <div className="mt-3 flex w-full flex-row items-center gap-2">
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
          </div>
        </div>
      </div>
    </Link>
  );
};

export default RecommendStorySection;
