export interface BlogMock {
  id: number;
  title: string;
  contents: string;
  likeCount: number;
  viewCount: number;
  readingTime: number;
  createdAt: string;
  updatedAt: string;
  user: {
    id: number;
    nickname: string;
    cohort: number;
    avatarUrl: string | null;
  };
}

export const BlogMockList: BlogMock[] = [
  {
    id: 1,
    title: '이벤트 기반 아키텍처를 선택한 이유',
    contents:
      '영상 처리 시스템을 이벤트 기반으로 설계하며 겪은 고민과 선택 과정 정리',
    likeCount: 32,
    viewCount: 420,
    readingTime: 6,
    createdAt: '2025-01-05T10:00:00Z',
    updatedAt: '2025-01-06T12:30:00Z',
    user: {
      id: 101,
      nickname: 'devju',
      cohort: 31,
      avatarUrl: null,
    },
  },
  {
    id: 2,
    title: 'Docker Compose로 개발 환경 통합하기',
    contents: '프론트엔드, 백엔드, DB를 하나의 Compose로 관리하는 방법',
    likeCount: 45,
    viewCount: 680,
    readingTime: 8,
    createdAt: '2025-01-08T09:20:00Z',
    updatedAt: '2025-01-09T14:10:00Z',
    user: {
      id: 102,
      nickname: 'ariimo',
      cohort: 31,
      avatarUrl: null,
    },
  },
  {
    id: 3,
    title: '벡터 데이터베이스 직접 구현해보기',
    contents: '외부 라이브러리 없이 벡터 DB를 구현하며 배운 점',
    likeCount: 61,
    viewCount: 910,
    readingTime: 10,
    createdAt: '2025-01-11T11:45:00Z',
    updatedAt: '2025-01-12T18:00:00Z',
    user: {
      id: 103,
      nickname: 'jichan',
      cohort: 31,
      avatarUrl: null,
    },
  },
  {
    id: 4,
    title: 'Next.js에서 이미지 최적화 전략',
    contents: 'next/image를 사용하면서 알게 된 최적화 포인트 정리',
    likeCount: 27,
    viewCount: 350,
    readingTime: 5,
    createdAt: '2025-01-13T08:30:00Z',
    updatedAt: '2025-01-14T13:40:00Z',
    user: {
      id: 104,
      nickname: 'chaJi',
      cohort: 31,
      avatarUrl: null,
    },
  },
  {
    id: 5,
    title: '프론트엔드 상태 관리를 Zustand로 선택한 이유',
    contents: 'Redux 대신 Zustand를 선택한 배경과 실제 사용 경험',
    likeCount: 54,
    viewCount: 770,
    readingTime: 7,
    createdAt: '2025-01-16T12:10:00Z',
    updatedAt: '2025-01-17T19:25:00Z',
    user: {
      id: 105,
      nickname: 'minsu',
      cohort: 31,
      avatarUrl: null,
    },
  },
  {
    id: 6,
    title: 'NestJS 서비스 레이어 테스트 전략',
    contents: '의존성을 최소화한 서비스 단위 테스트 작성 방법',
    likeCount: 39,
    viewCount: 560,
    readingTime: 9,
    createdAt: '2025-01-18T15:00:00Z',
    updatedAt: '2025-01-19T21:10:00Z',
    user: {
      id: 106,
      nickname: 'hyeon',
      cohort: 31,
      avatarUrl: null,
    },
  },
];
