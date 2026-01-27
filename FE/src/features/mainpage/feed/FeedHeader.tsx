import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const FeedHeader = () => {
  return (
    <div className="flex flex-row justify-between items-center mt-8">
      <h1 className="text-display-24">캠퍼들의 이야기</h1>
      <Link
        href="/stories"
        className="text-neutral-text-weak hover:text-neutral-text-strong text-string-16 transition-colors duration-150 flex flex-row items-center gap-1"
      >
        더보기 <ArrowRight size={16} />
      </Link>
    </div>
  );
};

export default FeedHeader;
