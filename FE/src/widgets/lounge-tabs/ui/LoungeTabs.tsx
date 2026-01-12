'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, HelpCircle, Trees, GitPullRequest, Lock } from 'lucide-react';

// 탭 설정 (URL과 아이콘 매핑)
const TABS = [
  { href: '/lounge', label: '라운지 홈', icon: Home, exact: true },
  { href: '/lounge/qna', label: '질문 & 답변', icon: HelpCircle },
  { href: '/lounge/bamboo', label: '익명 대나무숲', icon: Trees },
  { href: '/lounge/open-source', label: '오픈소스 기여', icon: GitPullRequest },
  { href: '/lounge/camper', label: '캠퍼 공간', icon: Lock },
];

export const LoungeTabs = () => {
  const pathname = usePathname();

  return (
    <div className="bg-[#F0F4FA] w-full">
      <div className="mb-8">
        <h2 className="mb-4 font-bold text-3xl">라운지</h2>
        <p className="text-gray-600">BoostUS 커뮤니티 공간</p>
      </div>
      <div className="flex gap-2 mb-8 border-b border-b-gray-300 w-full overflow-x-auto">
        {TABS.map((tab) => {
          // 현재 활성화 여부 체크
          const isActive = tab.exact
            ? pathname === tab.href
            : pathname.startsWith(tab.href);

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`px-6 py-3 font-medium transition-colors whitespace-nowrap flex items-center gap-2 ${
                isActive
                  ? 'text-[#005CFD] border-b-2  border-[#005CFD]'
                  : 'text-gray-600 hover:text-gray-900 '
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
};
