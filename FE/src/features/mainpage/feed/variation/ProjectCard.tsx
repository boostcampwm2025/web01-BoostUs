import paint from "../../../../../public/assets/paint.png";
import Image from "next/image";

const ProjectCard = () => {
  return (
    <>
      <div className="relative mb-4 w-full">
        <Image src={paint} alt="프로젝트 이미지" className="w-full h-auto" />
        <div className="top-2 left-2 absolute flex flex-col justify-center items-center bg-green-100 px-2 py-1 rounded-md">
          <span className="font-semibold text-green-700 text-xs">프로젝트</span>
        </div>
      </div>
      <span className="font-bold text-lg">실시간 협업 화이트보드</span>
      <span className="font-light text-gray-700 text-sm">WebSocket 기반 멀티플레이어 드로잉 앱</span>
    </>
  );
};

export default ProjectCard;
