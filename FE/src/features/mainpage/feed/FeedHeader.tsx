import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const FeedHeader = () => {
  return (
    <div className="flex flex-row justify-between items-center mt-8">
      <h1 className="font-bold text-2xl">캠퍼들의 이야기</h1>
      <Link
        href="/stories"
        className="text-neutral-text-strong flex flex-row items-center gap-1"
      >
        더보기 <ArrowRight size={16} />
      </Link>
    </div>
  );
};

export default FeedHeader;
