const QnaCard = () => {
  return (
    <>
      <div className="flex flex-col justify-center items-center bg-blue-100 px-2 py-1 rounded-md w-fit">
        <span className="font-semibold text-blue-700 text-xs">Q&A</span>
      </div>
      <span className="mt-2 font-bold text-md">Next.js App Router 사용법 질문</span>
      <span className="mt-4 text-gray-500 text-xs">답변 5</span>
    </>
  );
};

export default QnaCard;
