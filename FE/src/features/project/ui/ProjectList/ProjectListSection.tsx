'use client';

import { useEffect, useMemo, useState } from 'react';
import ProjectListCard from '@/features/project/ui/ProjectList/ProjectListCard';
import { useSearchParams } from 'next/navigation';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { fetchProjects, Project } from '@/features/project/api/getProjects';
import { motion } from 'framer-motion';

const SORT_ORDER = {
  TEAM_NUM: '팀 번호 순',
  VIEW_COUNT: '조회수 순',
} as const;

type SortOrderType = (typeof SORT_ORDER)[keyof typeof SORT_ORDER];

type SortOrderKey = keyof typeof SORT_ORDER;

type SortOption = {
  key: SortOrderType;
  label: string;
};

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

  const sortOptions: SortOption[] = useMemo(() => {
    return (Object.keys(SORT_ORDER) as SortOrderKey[]).map((k) => ({
      key: SORT_ORDER[k],
      label: SORT_ORDER[k],
    }));
  }, []);

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
      <div className="flex justify-between">
        <span className="text-strong-medium16 text-black">
          총{' '}
          <span className="text-strong-medium16 font-semibold text-blue-700">
            {filteredProjects.length}
          </span>
          개의 프로젝트
        </span>

        <div className="flex flex-row flex-wrap gap-2">
          {sortOptions.map((option) => {
            const isSelected = sortOrder === option.key;

            return (
              <button
                key={option.key}
                type="button"
                onClick={() => setSortOrder(option.key)}
                className="relative flex w-auto cursor-pointer items-center justify-center rounded-lg p-1 transition-colors duration-300"
              >
                {isSelected && (
                  <motion.div
                    layoutId="ranking-active-pill"
                    className="bg-neutral-surface-bold shadow-default absolute inset-0 rounded-lg"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                <span
                  className={`relative z-10 ${
                    isSelected
                      ? 'text-string-14 text-neutral-text-strong'
                      : 'text-body-14 text-neutral-text-weak'
                  }`}
                >
                  {option.label}
                </span>
              </button>
            );
          })}
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
