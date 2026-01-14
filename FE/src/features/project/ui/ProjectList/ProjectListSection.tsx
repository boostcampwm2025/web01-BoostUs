'use client';

import { useState } from 'react';
import ProjectListCard from '@/features/project/ui/ProjectList/ProjectListCard';
import { useSearchParams } from 'next/navigation';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { mockProjects } from '@/features/project/ui/ProjectList/data';

const SORT_ORDER = {
  TEAM_NUM: '팀 번호 순',
  VIEW_COUNT: '조회수 순',
} as const;

type SortOrderType = (typeof SORT_ORDER)[keyof typeof SORT_ORDER];

const ProjectListSection = () => {
  const [sortOrder, setSortOrder] = useState<SortOrderType>(
    SORT_ORDER.TEAM_NUM
  );
  const searchParams = useSearchParams();
  const field = searchParams.get('field') ?? '전체';
  const cohort = searchParams.get('cohort') ?? '전체';

  const filteredProjects = mockProjects
    .filter((project) => {
      if (field !== '전체' && project.field !== field) return false;
      return !(cohort !== '전체' && project.cohort !== parseInt(cohort));
    })
    .sort((a, b) => {
      if (sortOrder === SORT_ORDER.TEAM_NUM) {
        return a.id - b.id;
      } else {
        return b.views - a.views;
      }
    });

  return (
    <section className="mt-8 mb-20 flex w-full flex-col gap-4">
      <div className="flex flex-row justify-between">
        <span className="text-strong-medium16 text-black">
          총{' '}
          <span className="text-strong-medium16 font-semibold text-blue-700">
            {filteredProjects.length}
          </span>
          개의 프로젝트
        </span>
        <div className="flex flex-wrap gap-2">
          <button
            className="text-neutral-text-default text-strong-medium16 flex flex-row items-center gap-1"
            onClick={() =>
              setSortOrder(
                sortOrder === '팀 번호 순' ? '조회수 순' : '팀 번호 순'
              )
            }
          >
            {sortOrder}{' '}
            {sortOrder === '팀 번호 순' ? <ChevronDown /> : <ChevronUp />}
          </button>
        </div>
      </div>
      <div className="grid w-full grid-cols-4 gap-8">
        {filteredProjects.map((project) => (
          <ProjectListCard key={project.id} project={project} />
        ))}
      </div>
    </section>
  );
};

export default ProjectListSection;
