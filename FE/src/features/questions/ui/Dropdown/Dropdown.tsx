'use client';

import {
  QuestionsSortBy,
  useQuestionsContext,
} from '@/features/questions/model';
import {
  Dropdown,
  DropdownContent,
  DropdownItem,
  DropdownTrigger,
} from '@/shared/ui/Dropdown';

const SORT_BY_OPTIONS = [
  { key: 'latest', label: '최신순' },
  { key: 'likes', label: '인기순' },
  { key: 'views', label: '조회순' },
] as const;

const QuestionsDropdown = () => {
  const { sort, setSort } = useQuestionsContext();

  const currentLabel = SORT_BY_OPTIONS.find(
    (option) => option.key === sort
  )?.label;

  return (
    <Dropdown className="flex justify-end">
      <DropdownTrigger label={currentLabel} />
      <DropdownContent className="w-40 mt-7">
        <div className="flex flex-col divide-y divide-neutral-border-default">
          {SORT_BY_OPTIONS.map((option) => (
            <DropdownItem
              key={option.key}
              label={option.label}
              isSelected={sort === option.key}
              onClick={() => setSort(option.key as QuestionsSortBy)}
            />
          ))}
        </div>
      </DropdownContent>
    </Dropdown>
  );
};

export default QuestionsDropdown;
