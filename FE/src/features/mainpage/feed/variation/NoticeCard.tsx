const NoticeCard = () => {
  return (
    <>
      <div className="flex flex-row items-center gap-2">
        <div className="flex flex-col justify-center items-center bg-blue-500 px-2 py-1 rounded-md w-fit">
          <span className="font-semibold text-white text-xs">공지사항</span>
        </div>
      </div>
      <span className="font-bold text-white text-lg">BoostUs에 어서오세요!</span>
      <span className="font-light text-white text-sm">모든 경험을 하나로 연결하는 BoostUs에 오신 걸 환영해요~</span>
      <div className="flex justify-end">
        <span className="font-light text-white text-xs">2025-12-17</span>
      </div>
    </>
  );
};

export default NoticeCard;
