'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  { href: '/', label: '서비스 소개' },
  { href: '/project', label: '프로젝트' },
  { href: '/stories', label: '캠퍼들의 이야기' },
  { href: '/qna', label: '질문 & 답변' },
];

const Header = () => {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <header className="fixed top-0 z-50 flex items-center justify-center w-full h-20 px-4 bg-neutral-surface-bold backdrop-blur-sm shadow-default">
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
