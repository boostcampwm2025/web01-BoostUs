'use client';

import { use, useEffect, useState } from 'react';
import ProjectListCard from '@/features/project/ui/ProjectList/ProjectListCard';
import { useSearchParams } from 'next/navigation';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { fetchProjects, Project } from '@/features/project/api/getProjects';

const SORT_ORDER = {
  TEAM_NUM: '팀 번호 순',
  VIEW_COUNT: '조회수 순',
} as const;

type SortOrderType = (typeof SORT_ORDER)[keyof typeof SORT_ORDER];

const ProjectListSection = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState<SortOrderType>(
    SORT_ORDER.TEAM_NUM
  );

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const data = await fetchProjects();
        setProjects(data.items); // 받아온 데이터의 items를 state에 저장
      } catch (error) {
        console.error('데이터 로드 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };

    void loadData();
  }, []); // 빈 배열: 마운트 시 1회만 실행

  const searchParams = useSearchParams();
  const field = searchParams.get('field') ?? '전체';
  const cohort = searchParams.get('cohort') ?? '전체';

  const filteredProjects = projects
    .filter((project) => {
      if (field !== '전체' && project.field !== field) return false;
      return !(cohort !== '전체' && project.cohort !== parseInt(cohort));
    })
    .sort((a, b) => {
      if (sortOrder === SORT_ORDER.TEAM_NUM) {
        return a.id - b.id;
      } else {
        return b.viewCount - a.viewCount;
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
                sortOrder === SORT_ORDER.TEAM_NUM
                  ? SORT_ORDER.VIEW_COUNT
                  : SORT_ORDER.TEAM_NUM
              )
            }
          >
            {sortOrder}{' '}
            {sortOrder === SORT_ORDER.TEAM_NUM ? (
              <ChevronDown />
            ) : (
              <ChevronUp />
            )}
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
