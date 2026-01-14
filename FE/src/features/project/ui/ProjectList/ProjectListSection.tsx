'use client';

import ProjectListCard from '@/features/project/ui/ProjectList/ProjectListCard';
import { useSearchParams } from 'next/navigation';

interface ProjectData {
  id: number;
  thumbnailUrl: string | null;
  title: string;
  description: string;
  cohort: number;
  techStack: string[];
  createdAt: string;
  updatedAt: string;
  field: string;
  views: number;
}

const mockProjects: ProjectData[] = [
  {
    id: 1,
    thumbnailUrl: 'https://cdn.example.com/thumbnails/project-1.png',
    title: 'BoostUs 커뮤니티 서비스',
    description:
      '부스트캠프 수료생과 예비 지원자를 위한 커뮤니티 서비스입니다.',
    cohort: 9,
    techStack: ['NestJS', 'Prisma', 'Next'],
    createdAt: '2024-07-01T10:00:00',
    updatedAt: '2024-08-20T15:30:00',
    cohort: 10,
    techStack: ['NestJS', 'Prisma', 'Next'],
    createdAt: '2024-07-01T10:00:00',
    updatedAt: '2024-08-20T15:30:00',
    field: 'Web',
    views: 123,
  },
  {
    id: 2,
    thumbnailUrl: null,
    title: 'Web OS',
    description:
      '부스트캠프 그룹 스프린트로 진행한 웹 기반 OS 에뮬레이션 서비스입니다.',
    cohort: 10,
    techStack: ['React', 'NestJS', 'MySQL'],
    createdAt: '2024-09-01T09:00:00',
    updatedAt: '2024-10-01T12:00:00',
    field: 'IOS',
    views: 456,
  },
  {
    id: 3,
    thumbnailUrl: 'https://cdn.example.com/thumbnails/project-3.png',
    title: '실시간 협업 화이트보드',
    description: 'WebSocket 기반 멀티플레이어 드로잉 앱',
    cohort: 9,
    techStack: ['Next.js', 'Node.js', 'Socket.io'],
    createdAt: '2024-06-15T14:20:00',
    updatedAt: '2024-09-10T08:45:00',
    field: 'Web',
    views: 789,
  },
  {
    id: 4,
    thumbnailUrl: 'https://cdn.example.com/thumbnails/project-4.png',
    title: 'AI 코드 리뷰 플랫폼',
    description: 'OpenAI API를 활용한 자동 코드 리뷰 시스템',
    cohort: 10,
    techStack: ['TypeScript', 'FastAPI', 'PostgreSQL'],
    createdAt: '2024-08-05T11:30:00',
    updatedAt: '2024-09-20T16:15:00',
    field: 'Android',
    views: 100,
  },
];

const ProjectListSection = () => {
  const [sortOrder, setSortOrder] = useState<'팀 번호 순' | '조회수 순'>(
    '팀 번호 순'
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
      if (sortOrder === '팀 번호 순') {
        return a.cohort - b.cohort;
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
            {sortOrder} <ChevronDown />
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
