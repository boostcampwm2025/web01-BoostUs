const BambooCard = () => {
  return (
    <>
      <div className="flex flex-row items-center">
        <div className="flex flex-col justify-center items-center bg-green-200 px-2 py-1 rounded-md w-fit">
          <span className="font-semibold text-green-700 text-xs">대나무숲</span> {/* TODO: 아이콘 대체 */}
        </div>
      </div>
      <p className="font-light text-black text-sm">
        오늘 드디어 첫 PR이 머지되었어요! 너무 기뻐요~ 개발자로서 협업 첫 걸음입니다!
      </p>
      <div className="flex justify-end">
        <button className="bg-white px-2 rounded-full w-fit font-medium text-sm">👍 23</button>
      </div>
    </>
  );
};

export default BambooCard;
