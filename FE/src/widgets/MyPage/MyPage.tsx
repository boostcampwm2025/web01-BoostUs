'use client';

import { useAuth } from '@/features/login/model/auth.store';
import MemberInfoManageSections from '@/features/myPage/ui/MemberInfoManageSections';
import ActivityGraph from '@/features/myPage/ui/ActivityGraph';
import MyBadge from '@/features/myPage/ui/MyBadge';
import MyViews from '@/features/myPage/ui/MyViews';

export default function MyPage() {
  const { member, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center gap-2 bg-black rounded-lg">
        <div className="text-white p-2 text-string-16">로딩 중...</div>
      </div>
    );
  }

  // 데이터가 없거나 로딩이 끝났는데 멤버가 없으면 부모 페이지에서 리다이렉트 처리함
  if (!member) return null;

  return (
    <div className="w-full max-w-7xl mx-auto p-4 flex flex-col md:flex-row items-start gap-6">
      <div className="w-full md:w-95 flex flex-col gap-6 shrink-0">
        <MemberInfoManageSections />
        <MyBadge />
      </div>

      <div className="w-full flex-1 flex flex-col gap-6">
        <ActivityGraph />
        <MyViews />
      </div>

      {/*<div*/}
      {/*  style={{*/}
      {/*    position: 'fixed',*/}
      {/*    bottom: '20px',*/}
      {/*    right: '20px',*/}
      {/*    backgroundColor: 'rgba(0,0,0,0.8)',*/}
      {/*    color: 'white',*/}
      {/*    padding: '10px',*/}
      {/*    borderRadius: '8px',*/}
      {/*    fontSize: '12px',*/}
      {/*    zIndex: 9999,*/}
      {/*  }}*/}
      {/*>*/}
      {/*  <h3>🔑 MyPage 모니터링</h3>*/}
      {/*  <pre>{JSON.stringify(member, null, 2)}</pre>*/}
      {/*</div>*/}
    </div>
  );
}
