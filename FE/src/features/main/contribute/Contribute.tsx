import Link from 'next/link';

export default function Contribute() {
  return (
    <div className="flex flex-col px-6 py-3 items-center justify-center bg-accent-blue h-full text-white mt-12 rounded-4xl">
      <div className="flex flex-col gap-1 text-center">
        <span className="text-2xl font-bold mb-3">
          우리 모두가 함께 만들어가는 지속 가능한 커뮤니티 &nbsp;
        </span>
        <span className="text-lg mb-12">
          필요한 기능이 있따면 자유롭게 제안하고 기여해보세요.
        </span>
      </div>

      <div className={'flex flex-col gap-4 text-center w-2/3 '}>
        <Link
          href="/"
          className="text-2xl text-accent-blue  py-3 flex items-center justify-center gap-1 bg-grayscale-50 rounded-2xl"
        >
          기여 가이드 보러가기
        </Link>

        <Link
          href="/"
          className="text-2xl text-accent-blue  py-3 flex items-center justify-center gap-1 bg-grayscale-50 rounded-2xl "
        >
          기여하기
        </Link>
      </div>
    </div>
  );
}
