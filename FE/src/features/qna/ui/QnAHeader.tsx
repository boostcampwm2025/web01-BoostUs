'use client';

import { useRouter, useSearchParams } from 'next/navigation';

export default function QnAHeader() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL에서 현재 필터 값을 가져옴 (없으면 기본값 'all')
  const currentFilter = searchParams.get('filter') || 'all';

  const handleFilterChange = (filter: string) => {
    // URL을 변경하여 페이지 이동 (실제로는 같은 페이지 내에서 파라미터만 변경됨)
    router.push(`/lounge/qna?filter=${filter}`);
  };

  return (
    <div className="mb-8">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-gray-600">기술 질문, 고민 상담</p>
        </div>
        <button className="px-6 py-2 bg-[#005CFD] text-white rounded-lg hover:bg-[#0048CC] transition-colors">
          질문하기
        </button>
      </div>

      {/* 필터 */}
      <div className="flex gap-2">
        <button
          onClick={() => handleFilterChange('all')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            currentFilter === 'all'
              ? 'bg-[#005CFD] text-white'
              : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
          }`}
        >
          전체
        </button>
        <button
          onClick={() => handleFilterChange('unanswered')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            currentFilter === 'unanswered'
              ? 'bg-[#005CFD] text-white'
              : 'bg-white border text-gray-600 border-gray-200 hover:bg-gray-50'
          }`}
        >
          답변 대기중
        </button>
        <button
          onClick={() => handleFilterChange('popular')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            currentFilter === 'popular'
              ? 'bg-[#005CFD] text-white'
              : 'bg-white border text-gray-600 border-gray-200 hover:bg-gray-50'
          }`}
        >
          인기 질문
        </button>
      </div>
    </div>
  );
}
