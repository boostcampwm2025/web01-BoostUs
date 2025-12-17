import QuickMenuCard from "./QuickMenuCard";

const QuickMenuSection = () => {
  return (
    <div className="flex flex-row gap-4 mb-8 w-full">
      <QuickMenuCard
        menuName={"프로젝트 탐색하기"}
        description={"역대 모든 부스트캠퍼들의 \n놀라운 프로젝트를 만나보세요"}
      />
      <QuickMenuCard menuName={"캠퍼들의 이야기"} description={"'리액트' 등 5개의 \n새로운 글이 올라왔어요"} />
      <QuickMenuCard menuName={"라운지 바로가기"} description={"질문부터 잡담까지,\n자유롭게 소통해보세요"} />
    </div>
  );
};

export default QuickMenuSection;
