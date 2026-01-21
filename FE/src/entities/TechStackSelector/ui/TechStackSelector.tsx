'use client';

import { useState } from 'react';
import {
  TechStackResponse,
  TechStackItem,
} from '@/entities/TechStackSelector/model/types';

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

export function TechStackSelector({
  data,
  selectedStack = [],
  onChange,
}: TechStackSelectorProps) {
  const [activeTab, setActiveTab] = useState<string>('FRONTEND');
  const tabs = Object.keys(data);

  // 아이템 토글 (이름 기반으로 비교)
  const toggleItem = (item: TechStackItem) => {
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
    <div className="w-full rounded-md border border-gray-300 p-4">
      {/* 상단 선택된 아이템 영역 */}
      <div className="flex flex-wrap gap-2 mb-4 min-h-[40px] bg-gray-50 p-3 rounded-lg border border-gray-100">
        {selectedStack.length === 0 && (
          <span className="text-gray-400 text-sm py-1">
            아래에서 기술 스택을 선택해주세요.
          </span>
        )}
        {selectedStack.map((name) => (
          <div
            key={name}
            className="flex items-center gap-1 px-3 py-1 bg-white border border-gray-200 rounded-full text-blue-600 text-sm font-medium shadow-sm"
          >
            <button
              type="button" // form submit 방지
              onClick={() => removeItem(name)}
              className="hover:text-red-500 mr-1 text-gray-400 font-bold"
            >
              ×
            </button>
            {name}
          </div>
        ))}
      </div>

      {/* 중간 탭 네비게이션 */}
      <div className="flex items-center gap-4 mb-4 overflow-x-auto border-b border-gray-200">
        {tabs.map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setActiveTab(key)}
            className={`text-sm font-semibold pb-2 whitespace-nowrap transition-colors ${
              activeTab === key
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            {CATEGORY_LABELS[key] || key}
          </button>
        ))}
      </div>

      {/* 하단 아이템 리스트  */}
      <div className="flex flex-wrap gap-2 max-h-[200px] overflow-y-auto pr-2">
        {data[activeTab]?.map((item) => {
          const isSelected = selectedStack.includes(item.name);

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => toggleItem(item)}
              className={`px-3 py-1.5 rounded-full border text-sm transition-all ${
                isSelected
                  ? 'border-blue-500 text-blue-600 bg-blue-50 font-semibold'
                  : 'border-gray-200 text-gray-600 hover:bg-gray-100'
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
