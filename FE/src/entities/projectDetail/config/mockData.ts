import { ProjectResponse } from '@/entities/projectDetail/model/types';

export const MOCK_PROJECT_DETAIL: ProjectResponse = {
  success: true,
  message: '성공적으로 응답되었습니다',
  error: null,
  data: {
    id: 1,
    thumbnailUrl: 'https://cdn.example.com/thumbnails/project-1.png',
    title: 'BoostUs 커뮤니티 서비스',
    description:
      '부스트캠프 수료생과 예비 지원자를 위한 커뮤니티 서비스입니다.',
    stacks: ['Next.js', 'Tailwind CSS', 'NestJS', 'PostgreSQL'],
    summary: '부스트캠프 기반 커뮤니티 플랫폼',
    // Template Literal을 사용하여 줄바꿈(\n)을 자연스럽게 처리했습니다.
    contents: `
# 프로젝트 상세 설명 및 기술 스택

## 1. 프로젝트 소개
부스트캠프 수료생들이 서로 소통하고 프로젝트를 공유할 수 있는 공간입니다.

## 2. 주요 기능
- 프로젝트 자랑하기
- 회고 작성 및 공유
- 기수별 네트워킹

## 3. 기술 스택
- Frontend: Next.js, Tailwind CSS
- Backend: NestJS, PostgreSQL
    `.trim(),
    repositoryUrl: 'https://github.com/boostcampwm2025/boostus',
    demoUrl: 'https://boostus.example.com',
    cohort: 9,
    startDate: '2024-07-01',
    endDate: '2024-08-31',
    createdAt: '2024-07-01T10:00:00',
    updatedAt: '2024-08-20T15:30:00',
    members: [
      {
        id: 1,
        nickname: 'Jack',
        avatarUrl: 'https://cdn.example.com/avatars/jack.png',
      },
      {
        id: 2,
        nickname: 'Willy',
        avatarUrl: 'https://cdn.example.com/avatars/willy.png',
      },
    ],
  },
};
