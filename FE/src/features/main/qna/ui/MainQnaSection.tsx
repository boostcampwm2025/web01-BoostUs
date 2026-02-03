'use client';

import { useState } from 'react';
import {
  fetchQnaMain,
  MAIN_QNA_KEY,
} from '@/features/main/qna/api/fetchQnaMain';
import QnaCard from '@/features/main/qna/ui/QnaCard';
import { useQuery } from '@tanstack/react-query';

type TabType = 'ALL' | 'UNANSWERED';

export default function MainQnaSection() {
  const [activeTab, setActiveTab] = useState<TabType>('ALL');

  const { data: response, isLoading } = useQuery({
    queryKey: [MAIN_QNA_KEY, activeTab], // 탭 바뀔 때마다 키 변경 -> 자동 refetch
    queryFn: () =>
      fetchQnaMain({
        status: activeTab === 'ALL' ? 'all' : 'unanswered',
        size: 3,
      }),
    staleTime: 1000 * 60,
  });

  const questions = response?.data?.items ?? [];

  // TODO: 스켈레톤 UI 교체
  if (isLoading)
    return (
      <div className="h-40 flex items-center justify-center">로딩 중...</div>
    );

  return (
    <section className="w-full h-full">
      <div className="flex flex-col w-full  overflow-hidden border border-neutral-border-default rounded-2xl bg-neutral-surface-bold">
        <div className="flex items-center justify-end w-full px-6 py-3 border-b border-neutral-border-default bg-white">
          <div className="flex bg-neutral-100 p-1 rounded-lg gap-1 w-fit">
            <button
              onClick={() => setActiveTab('ALL')}
              className={`px-3 py-1.5 text-string-12 rounded-md transition-all duration-200 ${
                activeTab === 'ALL'
                  ? 'bg-white text-neutral-text-strong shadow-default'
                  : 'text-neutral-text-weak hover:text-neutral-text-default'
              }`}
            >
              최신 질문
            </button>
            <button
              onClick={() => setActiveTab('UNANSWERED')}
              className={`px-3 py-1.5 text-string-12 rounded-md transition-all duration-200 ${
                activeTab === 'UNANSWERED'
                  ? 'bg-white text-neutral-text-strong shadow-sm'
                  : 'text-neutral-text-weak hover:text-neutral-text-default'
              }`}
            >
              답변 대기
            </button>
          </div>
        </div>

        {/* 리스트 영역 */}
        <div className="flex-1 flex flex-col divide-y divide-neutral-border-default">
          {questions.length > 0 ? (
            questions.map((question) => (
              <QnaCard key={question.id} question={question} />
            ))
          ) : (
            <div className="flex flex-1 items-center justify-center min-h-40 text-body-14 text-neutral-text-weak bg-neutral-surface-bold">
              등록된 질문이 없습니다.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
