'use client';

import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperClass } from 'swiper/types';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';

import { Pause, Play } from 'lucide-react';

export default function RecommendProjectSection() {
  const [swiperInstance, setSwiperInstance] = useState<SwiperClass | null>(
    null
  );
  const [isPlaying, setIsPlaying] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  const slides = [
    {
      id: 1,
      image: '/api/placeholder/800/600',
      category: '프로젝트',
      title: '부스트캠프 커뮤니티 서비스',
      description: '우리 프로젝트 화이팅~',
      color: 'bg-slate-800',
    },
    {
      id: 2,
      image: '/api/placeholder/800/600',
      category: '스터디',
      title: '알고리즘 정복하기',
      description: '매일 아침 9시, 함께 성장해요.',
      color: 'bg-amber-800',
    },
    {
      id: 3,
      image: '/api/placeholder/800/600',
      category: '네트워킹',
      title: '개발자 커피챗',
      description: '현업 개발자와의 만남',
      color: 'bg-emerald-800',
    },
  ];

  const handleSlideChange = (index: number) => {
    swiperInstance?.slideToLoop(index);
  };

  const toggleAutoplay = () => {
    if (!swiperInstance) return;
    if (isPlaying) {
      swiperInstance.autoplay.stop();
    } else {
      swiperInstance.autoplay.start();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="relative w-full h-[500px] overflow-hidden rounded-xl bg-gray-900 text-white">
      <Swiper
        modules={[Autoplay]}
        spaceBetween={0}
        slidesPerView={1}
        loop={true}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        onSwiper={setSwiperInstance}
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
        className="w-full h-full"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div
              className={`w-full h-full flex items-center justify-center ${slide.color}`}
            >
              <h2 className="text-4xl font-bold opacity-50">IMAGE MOCKUP</h2>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10 pointer-events-none" />

      <div className="absolute bottom-0 left-0 w-full p-8 z-20 flex justify-between items-end">
        {/* 왼쪽 텍스트 */}
        <div className="flex flex-col gap-2">
          <span className="bg-brand-surface-default text-string-14 font-bold px-3 py-1 rounded-full w-fit">
            {slides[activeIndex]?.category}
          </span>
          <h1 className="text-display-24">{slides[activeIndex]?.title}</h1>
          <p className="text-body-14 text-brand-text-on-default">
            {slides[activeIndex]?.description}
          </p>
        </div>

        {/* 오른쪽 컨트롤러 영역 */}
        <div className="flex items-center gap-4 bg-black/30 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
          {/* 커스텀 페이지네이션 */}
          <div className="flex gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => handleSlideChange(index)}
                className={`
                  h-2.5 rounded-full transition-all duration-300 ease-out 
                  ${
                    activeIndex === index
                      ? 'w-8 bg-neutral-surface-bold' // 활성 상태
                      : 'w-2.5 bg-gray-600 hover:bg-gray-400' // 비활성
                  }
                `}
                aria-label={`Go to slide ${(index + 1).toString()}`}
              />
            ))}
          </div>

          {/* 구분선  */}
          <div className="w-[1px] h-4 bg-gray-600"></div>

          {/* 재생/일시정지 버튼 */}
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
