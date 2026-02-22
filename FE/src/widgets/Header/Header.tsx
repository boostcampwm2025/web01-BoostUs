'use client';

import { useAuth } from '@/features/login/model/auth.store';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import useHeaderScroll from '@/widgets/Header/useHeaderScroll';
import useImageError from '@/shared/model/useImageError';

const NAV_ITEMS = [
  { href: '/landing', label: '서비스 소개' },
  { href: '/project', label: '프로젝트' },
  { href: '/stories', label: '캠퍼들의 이야기' },
  { href: '/questions', label: '질문 & 답변' },
];

const Header = () => {
  const pathname = usePathname();
  const { isScrolled } = useHeaderScroll();
  const { member, isAuthenticated, isLoading } = useAuth();
  const { isError: avatarError, setIsError: setAvatarError } = useImageError(
    member?.member?.avatarUrl
  );

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <header
      className={`fixed top-[calc(env(safe-area-inset-top))] z-50 flex h-20 w-full items-center justify-center px-4 transition-all duration-300 md:top-0 ${
        isScrolled
          ? 'bg-neutral-surface-bold/80 shadow-lift backdrop-blur-sm'
          : 'bg-neutral-surface-default'
      }`}
    >
      <div className="flex h-full w-full max-w-7xl items-center gap-3">
        <div className="w-28 shrink-0 md:w-36">
          <Link href="/">
            <Image
              src="/assets/Logo.svg"
              alt="boostus 로고"
              width={96}
              height={32}
              className="h-8 w-auto object-contain"
              priority
            />
          </Link>
        </div>
        <nav className="scrollbar-hide flex h-full min-w-0 flex-1 items-center gap-4 overflow-x-auto text-string-16 text-neutral-text-strong md:justify-center md:gap-10">
          {NAV_ITEMS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`flex h-full shrink-0 items-center whitespace-nowrap border-b-2 text-string-16 transition-colors text-neutral-text-default hover:text-brand-text-default ${
                isActive(href)
                  ? 'border-brand-border-default'
                  : 'border-transparent'
              }`}
              aria-current={isActive(href) ? 'page' : undefined}
            >
              {label}
            </Link>
          ))}
        </nav>
        <div className="flex w-auto shrink-0 items-center justify-end md:w-36">
          {isLoading ? (
            <div className="w-9 h-9 rounded-full animate-pulse bg-neutral-surface-strong" />
          ) : (
            <>
              {isAuthenticated && member ? (
                <Link
                  href="/mypage"
                  className="flex items-center transition-opacity hover:opacity-80"
                >
                  <div className="relative w-9 h-9 rounded-full overflow-hidden">
                    <Image
                      src={
                        avatarError || !member.member.avatarUrl
                          ? '/assets/NoImage.png'
                          : member.member.avatarUrl
                      }
                      alt={`${member.member.nickname}의 프로필 사진`}
                      className="object-cover"
                      fill
                      sizes="36px"
                      onError={() => setAvatarError(true)}
                    />
                  </div>
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="transition-colors text-string-16 text-neutral-text-default hover:text-brand-text-default"
                >
                  로그인
                </Link>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
