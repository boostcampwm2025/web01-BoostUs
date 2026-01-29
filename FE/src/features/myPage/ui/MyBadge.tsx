export default function MyBadge() {
  return (
    <>
      <div className="w-full max-w-md mx-auto h-full">
        {/* 전체 카드 컨테이너 */}
        <div className="bg-neutral-surface-bold border border-neutral-border-default rounded-2xl p-4 shadow-default h-full">
          <h3 className="text-display-20 text-neutral-text-strong mb-2">
            활동 배지
          </h3>
          <div className="flex flex-row items-center justify-center">
            <p className="text-neutral-text-weak text-body-14 text-center mb-6">
              준비중입니다.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
