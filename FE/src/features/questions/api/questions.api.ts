import {
  Answer,
  Question,
  QuestionDetail,
  QuestionsStatusFilter,
} from '@/features/questions/model/questions.type';
import { ApiResponse } from '@/shared/types/ApiResponseType';
import { Meta } from '@/shared/types/PaginationType';

export const getInitialQuestions = async (params?: {
  status?: QuestionsStatusFilter;
}) => {
  const isServerComponent = typeof window === 'undefined';

  const baseUrl = isServerComponent
    ? (process.env.INTERNAL_API_URL ?? 'http://backend:3000') // 서버 환경 (Docker 내부)
    : (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000'); // 클라이언트 환경 (브라우저)

  const searchParams = new URLSearchParams();

  if (params?.status && params.status !== 'all') {
    searchParams.append('status', params.status.toUpperCase());
  }

  const queryString = searchParams.toString();
  const endpoint = queryString
    ? `${baseUrl}/api/questions?${queryString}`
    : `${baseUrl}/api/questions`;

  const response = await fetch(endpoint, {
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch questions');
  }

  const data = (await response.json()) as ApiResponse<{
    items: Question[];
    meta: Meta;
  }>;

  return data;
};

export const getQuestionById = async (id: string) => {
  const isServerComponent = typeof window === 'undefined';

  const baseUrl = isServerComponent
    ? (process.env.INTERNAL_API_URL ?? 'http://backend:3000') // 서버 환경 (Docker 내부)
    : (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000'); // 클라이언트 환경 (브라우저)

  const url = `${baseUrl}/api/questions/${id}`;

  const response = await fetch(url, {
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch story by ID');
  }

  const data = (await response.json()) as ApiResponse<{
    question: QuestionDetail;
    answers: Answer[];
  }>;

  return data;
};

export const fetchQuestionsByCursor = async (
  cursor: Base64URLString | null
) => {
  const isServerComponent = typeof window === 'undefined';
  const baseUrl = isServerComponent
    ? (process.env.INTERNAL_API_URL ?? 'http://backend:3000') // 서버 환경 (Docker 내부)
    : (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000'); // 클라이언트 환경 (브라우저)

  const currentParams = new URLSearchParams(window.location.search);

  const statusParam = currentParams.get('status');

  if (statusParam) {
    if (statusParam === 'all') {
      // 'all'이면 백엔드 기본값이 ALL이므로 파라미터를 아예 제거합니다 (getInitialQuestions와 로직 통일)
      currentParams.delete('status');
    } else {
      // 그 외(solved 등)는 대문자로 변환해서 다시 설정
      currentParams.set('status', statusParam.toUpperCase());
    }
  }

  currentParams.delete('cursor');
  if (cursor) {
    currentParams.append('cursor', cursor);
  }

  const response = await fetch(
    `${baseUrl}/api/questions?${currentParams.toString()}`
  );
  if (!response.ok) throw new Error('Failed to fetch questions');

  const data = (await response.json()) as ApiResponse<{
    items: Question[];
    meta: Meta;
  }>;
  return data.data;
};
