'use client';

import Image from 'next/image';
import { ChevronDown } from 'lucide-react';
import ServiceStats from '@/features/landing/ui/ServiceStats';
import Link from 'next/link';
import { useLandingScroll } from '@/features/landing/model/useLandingScroll';
import ImageCard from '@/entities/landing/ImageCard';

const LandingPageContent = () => {
  const { firstSectionRef, secondSectionRef } = useLandingScroll();

  return (
    <article className="flex flex-col items-center w-full font-sans max-w-270">
      {/* 첫 번째 */}
      <section
        ref={firstSectionRef}
        className="flex flex-col items-center justify-center w-full min-h-screen text-center"
      >
        <h2 className="text-display-24 bg-linear-to-r from-brand-primary to-brand-dark bg-clip-text text-transparent">
          부스트캠퍼들의 모든 성장 경험을 기록하고, 연결하는 공간
        </h2>
        <h3 className="mt-3 text-body-16 text-neutral-text-weak">
          이어진 모든 기록을 자산으로 만들고, 성장이 다음 도전으로 이어지도록
          돕는 커뮤니티·아카이빙 플랫폼
        </h3>
        <Link href="/">
          <button className="flex items-center justify-center px-4 py-3 mt-12 cursor-pointer bg-brand-surface-default rounded-lg text-brand-text-on-default text-string-16">
            BoostUs 시작하기
          </button>
        </Link>
        <ServiceStats />
        <div className="relative w-full max-w-190 aspect-640/460">
          <Image
            src="/assets/landing.svg"
            alt="랜딩 페이지 이미지, BoostUs 메인 페이지의 모습"
            fill
            sizes="(max-width: 768px) 100vw, 760px"
            className="object-contain"
            priority
          />
        </div>

        <ChevronDown
          id="scroll-chevron"
          className="text-brand-dark animate-bounce absolute bottom-10 cursor-pointer"
          size={128}
          strokeWidth={0.5}
        />
      </section>
      {/* 두 번째 */}
      <section
        ref={secondSectionRef}
        className="flex flex-col items-center justify-start w-full max-w-252 min-h-screen pt-50 gap-80"
      >
        <ImageCard
          imageSrc="assets/ProjectImage.svg"
          subtitle="프로젝트 모아보기"
          title="한 곳에 모아 프로젝트를 더 가치 있게"
          description="부스트캠프의 모든 프로젝트를 한 눈에 모아 볼 수 있어요."
        />
        <ImageCard
          imageSrc="assets/StoriesImage.svg"
          subtitle="캠퍼들의 이야기"
          title="이야기를 연결하다"
          description="다양한 기술 블로그에 올라온 캠퍼들의 성장 경험과 모든 이야기를 모아 보고, 공유해보세요."
        />
        <ImageCard
          imageSrc="assets/RssImage.svg"
          subtitle="블로그 RSS 연동 지원"
          title="링크 하나로 간편하게 등록"
          description="본인의 지식과 경험이 담긴 기술 블로그가 있나요? RSS URL 하나만 입력하면 블로그의 글이 BoostUs에도 올라와요."
        />
        <ImageCard
          imageSrc="assets/QuestionsImage.svg"
          subtitle="질문 & 답변"
          title="집단지성의 힘으로 더 빠르게 성장하기"
          description="부스트캠프와 기술, 커리어 등 궁금한 모든 것들을 해결하고, 많은 사람들과 함께 성장해요."
        />
      </section>
      <section className="flex flex-col items-center pt-100 min-h-screen">
        <p className="text-neutral-text-strong text-string-20">
          지금 바로 시작해보세요
        </p>
        <p className="text-neutral-text-weak text-body-14 mt-1">
          BoostUs와 함께 성장해요.
        </p>
        <div className="flex flex-row items-center gap-4 mt-8">
          <Link href="/">
            <button className="flex items-center justify-center px-4 py-3 cursor-pointer bg-brand-surface-default rounded-lg text-brand-text-on-default text-string-16">
              BoostUs 시작하기
            </button>
          </Link>
          <button
            onClick={() => {
              window.scrollTo({
                top: 0,
                behavior: 'smooth',
              });
            }}
            className="flex items-center justify-center px-4 py-3 cursor-pointer bg-neutral-surface-strong rounded-lg border border-neutral-border-default hover:border-neutral-border-active text-neutral-text-default hover:text-brand-text-default transition-colors duration-150 text-string-16"
          >
            다시 알아보기
          </button>
        </div>
      </section>
    </article>
  );
};

export default LandingPageContent;
