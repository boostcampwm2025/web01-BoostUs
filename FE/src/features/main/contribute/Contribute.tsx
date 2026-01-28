import Link from 'next/link';

export default function Contribute() {
  return (
    <div className="flex flex-col px-6 py-20 items-center justify-center bg-brand-surface-default text-brand-text-on-default mt-13 rounded-2xl">
      <div className="flex flex-col gap-1 text-center">
        <span className="text-display-24 mb-3">
          우리 모두가 함께 만들어가는 지속 가능한 커뮤니티
        </span>
        <span className="text-string-20 mb-12">
          필요한 기능이 있다면 자유롭게 제안하고 기여해보세요.
        </span>
      </div>
      <div className={'flex flex-col gap-4 text-center w-2/3 '}>
        <Link
          href="/"
          className="text-string-16 text-brand-dark py-3 flex items-center justify-center gap-1 bg-neutral-surface-bold rounded-xl"
        >
          기여 가이드 보러가기
        </Link>

        <Link
          href="/"
          className="text-string-16 text-brand-dark py-3 flex items-center justify-center gap-1 bg-neutral-surface-bold rounded-xl"
        >
          기여하기
        </Link>
      </div>
    </div>
  );
}
