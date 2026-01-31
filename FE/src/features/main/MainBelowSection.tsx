import Link from 'next/link';
import MainQnaSection from '@/features/main/qna/ui/MainQnaSection';
import Contribute from '@/features/main/contribute/Contribute';

export default function MainBelowSection() {
  return (
    <section className="flex flex-col lg:flex-row gap-6 w-full">
      {/* 질문 & 답변 */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-4 justify-between mb-4">
          <h2 className="text-display-24 text-neutral-text-strong">
            질문 & 답변
          </h2>
          <Link
            href="/questions"
            className="text-neutral-text-weak hover:text-neutral-text-strong text-string-16 transition-colors duration-150 flex flex-row items-center gap-1"
          >
            더보기 &rarr;
          </Link>
        </div>
        <MainQnaSection />
      </div>

      {/* 기여하기 50% */}
      <div className="flex-1 min-w-0">
        <Contribute />
      </div>
    </section>
  );
}
