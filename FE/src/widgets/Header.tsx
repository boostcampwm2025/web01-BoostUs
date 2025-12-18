import Link from "next/link";

const Header = () => {
  return (
    <header className="top-0 z-50 fixed flex flex-row justify-center items-center bg-white/70 backdrop-blur-sm px-4 w-full h-16">
      <div className="flex flex-row items-center place-content-between w-7xl">
        <Link href="/">로고</Link>
        <div className="flex flex-row gap-4">
          <Link href="/">메인</Link>
          <Link href="/project">프로젝트</Link>
          <Link href="/">캠퍼들의 이야기</Link>
          <Link href="/">라운지</Link>
          <Link href="/">마이페이지</Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
