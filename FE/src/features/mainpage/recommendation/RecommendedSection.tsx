import paint from "../../../../public/assets/paint.png";
import Image from "next/image";

const RecommendedSection = () => {
  return (
    <>
      <h1 className="font-bold text-2xl">오늘의 추천</h1>
      <section className="flex flex-row gap-4 mt-4 w-full h-130">
        <article className="flex flex-col justify-center gap-2 bg-white shadow px-6 rounded-xl w-[70%]">
          <Image src={paint} alt="프로젝트 이미지" style={{ display: "block" }} />
          <div className="flex flex-col justify-center items-center bg-blue-600 px-2 py-1 rounded-full w-fit">
            <span className="font-bold text-white text-xs">메인 추천</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="font-bold text-2xl">실시간 협업 화이트보드</span>
            <span>WebSocket 기반 멀티플레이어 드로잉 앱</span>
            <span className="font-light text-sm">김철수</span>
          </div>
        </article>
        <div className="flex flex-col gap-4 w-[30%]">
          <article className="flex flex-col justify-center gap-2 bg-white shadow px-6 py-4 rounded-xl h-full">
            <div className="flex flex-col justify-center items-center bg-blue-100 px-2 py-1 rounded-md w-fit">
              <span className="font-semibold text-blue-700 text-xs">오늘의 아티클</span>
            </div>
            <span className="font-bold text-xl">React 18의 Concurrent Rendering 완벽 이해하기</span>
            <span className="font-light text-gray-700 text-sm">
              Suspense, Transition, 그리고 자동 배칭까지. React 18의 핵심 기능들을 실전 예제와 함께 알아봅니다.
            </span>
            <div>
              <span className="font-extralight text-gray-500 text-xs">김개발</span>
            </div>
          </article>
          <article className="flex flex-col justify-center gap-2 bg-white shadow px-6 py-4 rounded-xl h-full">
            <div className="flex flex-col justify-center items-center bg-green-100 px-2 py-1 rounded-md w-fit">
              <span className="font-semibold text-green-700 text-xs">주목할 프로젝트</span>
            </div>
            <span className="font-bold text-xl">실시간 협업 화이트보드</span>
          </article>
        </div>
      </section>
    </>
  );
};

export default RecommendedSection;
