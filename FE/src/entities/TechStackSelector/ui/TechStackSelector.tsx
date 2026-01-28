'use client';

import { useState } from 'react';
import {
  TechStackResponse,
  TechStackItem,
} from '@/entities/TechStackSelector/model/types';
import { X } from 'lucide-react';

// 탭 이름 매핑
const CATEGORY_LABELS: Record<string, string> = {
  FRONTEND: 'FE',
  BACKEND: 'BE',
  DATABASE: 'DB',
  INFRA: '인프라',
  MOBILE: '모바일',
  ETC: '기타',
};

interface TechStackSelectorProps {
  data: TechStackResponse;
  selectedStack: string[];
  onChange: (newStack: string[]) => void;
}

export default function TechStackSelector({
  data,
  selectedStack,
  onChange,
}: TechStackSelectorProps) {
  const [activeTab, setActiveTab] = useState<string>('FRONTEND');
  const tabs = Object.keys(data);

  // 아이템 토글 (이름 기반으로 비교)
  const toggleItem = (item: TechStackItem) => {
    /* TODO: 콘솔 지우기!! */
    console.log('클릭한 아이템:', item); // 여기서 name 속성이 진짜 있는지 확인!
    console.log('현재 스택:', selectedStack);
    const isSelected = selectedStack.includes(item.name);
    let newStack;

    if (isSelected) {
      newStack = selectedStack.filter((name) => name !== item.name);
    } else {
      newStack = [...selectedStack, item.name];
    }

    onChange(newStack);
  };

  // 선택된 아이템 삭제
  const removeItem = (nameToRemove: string) => {
    onChange(selectedStack.filter((name) => name !== nameToRemove));
  };

  return (
    <div className="w-full rounded-xl border border-neutral-border-default p-4">
      {/* 상단 선택된 아이템 영역 */}
      <div className="flex flex-wrap gap-2 mb-4 min-h-10 bg-transparent">
        {selectedStack.length === 0 && (
          <span className="text-body-14 text-neutral-text-weak py-1">
            아래에서 기술 스택을 선택해주세요.
          </span>
        )}
        {selectedStack.map((name) => (
          <div
            key={name}
            className="flex items-center gap-1 px-3 py-1 bg-neutral-surface-bold border border-neutral-border-default rounded-full text-neutral-text-default text-string-14"
          >
            {name}
            <button
              type="button" // form submit 방지
              onClick={() => removeItem(name)}
              className="hover:text-neutral-text-strong text-neutral-text-weak cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>

      {/* 중간 탭 네비게이션 */}
      <div className="flex items-center gap-4 mb-4 overflow-x-auto border-b border-neutral-border-default">
        {tabs.map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setActiveTab(key)}
            className={`cursor-pointer text-string-16 pb-2 whitespace-nowrap transition-colors duration-150 ${
              activeTab === key
                ? 'text-brand-text-default border-b border-brand-border-default'
                : 'text-neutral-text-weak hover:text-brand-text-default'
            }`}
          >
            {CATEGORY_LABELS[key] || key}
          </button>
        ))}
      </div>

      {/* 하단 아이템 리스트  */}
      <div className="flex flex-wrap gap-2 max-h-50 overflow-y-auto pr-2">
        {data[activeTab]?.map((item) => {
          const isSelected = selectedStack.includes(item.name);

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => toggleItem(item)}
              className={`px-3 py-1.5 rounded-full border text-string-14 transition-colors duration-150 cursor-pointer ${
                isSelected
                  ? 'border-brand-border-default text-brand-text-default bg-brand-surface-weak text-display-16'
                  : 'border-neutral-border-default bg-neutral-surface-bold text-neutral-text-default hover:bg-brand-surface-weak'
              }`}
            >
              {item.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
