import Link from "next/link";

const Header = () => {
  return (
    <header className="top-0 z-50 fixed flex flex-row items-center place-content-between bg-white px-4 w-full min-w-360 h-16">
      <Link href="/">로고</Link>
      <div className="flex flex-row gap-4">
        <Link href="/">메인</Link>
        <Link href="/">프로젝트</Link>
        <Link href="/">캠퍼들의 이야기</Link>
        <Link href="/">라운지</Link>
        <Link href="/">마이페이지</Link>
      </div>
    </header>
  );
};

export default Header;
