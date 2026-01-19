'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const NAV_ITEMS = [
  { href: '/landing', label: '서비스 소개' },
  { href: '/project', label: '프로젝트' },
  { href: '/stories', label: '캠퍼들의 이야기' },
  { href: '/questions', label: '질문 & 답변' },
];

const Header = () => {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);

  // 스크롤 이벤트 감지
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <header
      className={`fixed top-0 z-50 flex h-20 w-full items-center justify-center px-4 transition-all duration-300 ${
        isScrolled
          ? 'bg-neutral-surface-bold/80 shadow-lift backdrop-blur-sm' // 스크롤 시: 진한 배경(90% 불투명) + 그림자 + 블러
          : 'bg-neutral-surface-default' // 최상단: 기본 배경
      }`}
    >
      <div className="flex items-center justify-between w-full h-full max-w-7xl">
        <Link href="/" className="text-display-32 text-neutral-text-strong">
          BoostUs
        </Link>
        <nav className="flex h-full gap-10 text-string-16 text-neutral-text-strong">
          {NAV_ITEMS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center h-full border-b-2 transition-colors hover:text-accent-blue ${
                isActive(href) ? 'border-accent-blue' : 'border-transparent'
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>
        <Link
          href="/"
          className="transition-colors text-string-16 text-neutral-text-strong hover:text-accent-blue"
        >
          로그인
        </Link>
      </div>
    </header>
  );
};

export default Header;
