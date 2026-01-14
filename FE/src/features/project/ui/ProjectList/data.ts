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

export const mockProjects: ProjectData[] = [
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
