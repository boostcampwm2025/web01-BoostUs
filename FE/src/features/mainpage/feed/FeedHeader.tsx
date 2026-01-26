import Link from 'next/link';

const FeedHeader = () => {
  return (
    <div className="flex flex-row justify-between items-center mt-8">
      <h1 className="font-bold text-2xl">캠퍼들의 이야기</h1>
      <Link href="/stories" className="text-neutral-text-strong">
        더보기
      </Link>
    </div>
  );
};

export default FeedHeader;
