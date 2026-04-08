'use client';

import { useMemo, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperClass } from 'swiper/types';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import { useRouter } from 'next/navigation';
import { Pause, Play } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import {
  fetchRecoProject,
  RECO_PROJECT_QUERY_KEY,
} from '@/features/main/reco/api/fetchRecoProject';
import Image from 'next/image';

interface RecoProject {
  id: number;
  thumbnailUrl: string | null;
  title: string;
  description: string | null;
  field: string | null;
  teamNumber: number;
}

export default function RecommendProjectSection() {
  const router = useRouter();
  const [swiperInstance, setSwiperInstance] = useState<SwiperClass | null>(
    null
  );
  const [isPlaying, setIsPlaying] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  const {
    data: response,
    isLoading,
    isError,
  } = useQuery({
    queryKey: RECO_PROJECT_QUERY_KEY,
    queryFn: () => fetchRecoProject(),
  });

  const slides = useMemo(() => {
    const projects = (response?.data as RecoProject[]) ?? [];

    if (isLoading || isError || projects.length === 0) {
      return [
        {
          id: -1,
          image: '/api/placeholder/800/600',
          category: '프로젝트',
          title: isLoading
            ? '추천 프로젝트를 불러오는 중…'
            : '추천 프로젝트가 없습니다.',
          description: isError ? '데이터를 불러오는데 실패했습니다.' : '',
          color: 'bg-slate-800',
        },
      ];
    }

    return projects.slice(0, 3).map((p, idx) => ({
      id: p.id,
      image: p.thumbnailUrl ?? '/api/placeholder/800/600',
      category: p.field ?? '프로젝트',
      title: p.title,
      description: p.description ?? '',
      color: ['bg-slate-800', 'bg-amber-800', 'bg-emerald-800'][idx % 3],
    }));
  }, [response, isLoading, isError]);

  const handleSlideChange = (index: number) => {
    swiperInstance?.slideToLoop(index);
  };

  const toggleAutoplay = () => {
    if (!swiperInstance) return;
    if (isPlaying) swiperInstance.autoplay.stop();
    else swiperInstance.autoplay.start();
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="relative h-[22rem] w-full overflow-hidden rounded-xl border border-neutral-border-default text-white sm:h-125">
      <Swiper
        modules={[Autoplay]}
        spaceBetween={0}
        slidesPerView={1}
        loop={slides.length > 1}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        onSwiper={setSwiperInstance}
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
        className="w-full h-full"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={slide.id}>
            <div
              className={`relative w-full h-full ${slide.id !== -1 ? 'cursor-pointer' : ''}`}
              onClick={() => {
                if (slide.id !== -1)
                  router.push(`/project/${slide.id.toString()}`);
              }}
            >
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 1200px"
                quality={80}
                priority={index === 0}
              />
              <div className="absolute inset-0  pointer-events-none" />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent z-10 pointer-events-none" />

      <div className="absolute bottom-0 left-0 z-20 flex w-full flex-col gap-3 p-4 sm:flex-row sm:items-end sm:justify-between sm:p-8">
        <div className="flex min-w-0 flex-col gap-2">
          <span className="bg-brand-surface-default text-string-14 font-bold px-3 py-1 rounded-full w-fit">
            {slides[activeIndex]?.category}
          </span>
          <h1 className="text-display-20 line-clamp-2 break-keep sm:text-display-24">
            {slides[activeIndex]?.title}
          </h1>
          <p className="text-body-12 text-brand-text-on-default line-clamp-2 sm:text-body-14">
            {slides[activeIndex]?.description}
          </p>
        </div>

        <div className="flex items-center gap-3 self-start rounded-full border border-white/10 bg-black/30 px-3 py-1.5 backdrop-blur-md sm:self-auto sm:px-4 sm:py-2">
          <div className="flex gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => handleSlideChange(index)}
                className={`
                  h-2 rounded-full transition-all duration-300 ease-out sm:h-2.5
                  ${
                    activeIndex === index
                      ? 'w-6 bg-neutral-surface-bold sm:w-8'
                      : 'w-2 bg-gray-600 hover:bg-gray-400 sm:w-2.5'
                  }
                `}
                aria-label={`Go to slide ${(index + 1).toString()}`}
              />
            ))}
          </div>

          <div className="w-px h-4 bg-gray-600"></div>

          <button
            onClick={toggleAutoplay}
            className="text-gray-300 hover:text-white transition"
          >
            {isPlaying ? (
              <Pause size={18} fill="currentColor" />
            ) : (
              <Play size={18} fill="currentColor" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
