const BlogCard = () => {
  return (
    <>
      <div className="flex flex-row items-center gap-2">
        <div className="flex flex-col justify-center items-center bg-green-100 px-2 py-1 rounded-md w-fit">
          <span className="font-semibold text-green-700 text-xs">캠퍼들의 이야기</span>
        </div>
        <span className="font-light text-gray-400 text-xs">2025-12-17</span>
      </div>
      <span className="font-bold text-lg">React 18의 Concurrent Rendering 완벽 이해하기</span>
      <span className="font-light text-gray-700 text-sm">
        Suspense, Transition, 그리고 자동 배칭까지. React 18의 핵심 기능들을 실전 예제와 함께 알아봅니다.
      </span>
      <div>
        <span className="font-extralight text-gray-500 text-xs">김개발</span>
      </div>
    </>
  );
};

export default BlogCard;
