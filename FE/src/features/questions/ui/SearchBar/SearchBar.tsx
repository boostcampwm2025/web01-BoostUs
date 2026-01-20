'use client';

import { Search } from 'lucide-react';

const QuestionsSearchBar = () => {
  return (
    <div className="w-full">
      <div className="border-neutral-border-default bg-neutral-surface-bold flex h-10 w-full flex-row items-center rounded-xl border px-3 py-2.5">
        <Search className="text-neutral-text-weak" strokeWidth={1} size={20} />
        <input
          type="text"
          aria-label="질문 검색 바"
          placeholder="질문 검색..."
          className="w-full ml-2 text-body-16 text-neutral-text-default placeholder:text-neutral-text-weak bg-neutral-surface-bold focus:outline-none"
        />
      </div>
    </div>
  );
};

export default QuestionsSearchBar;
