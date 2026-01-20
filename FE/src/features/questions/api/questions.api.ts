import { Question } from '@/features/questions/model/questions.type';
import { ApiResponse } from '@/shared/types/ApiResponseType';

export const fetchQuestions = async () => {
  const isServerComponent = typeof window === 'undefined';

  const baseUrl = isServerComponent
    ? (process.env.INTERNAL_API_URL ?? 'http://backend:3000') // 서버 환경 (Docker 내부)
    : (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000'); // 클라이언트 환경 (브라우저)

  const response = await fetch(`${baseUrl}/api/questions`, {
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch questions');
  }

  const data = (await response.json()) as ApiResponse<{ items: Question[] }>;

  return data;
};

export const getQuestionById = async (id: string) => {
  const isServerComponent = typeof window === 'undefined';

  const baseUrl = isServerComponent
    ? (process.env.INTERNAL_API_URL ?? 'http://backend:3000') // 서버 환경 (Docker 내부)
    : (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000'); // 클라이언트 환경 (브라우저)

  const url = `${baseUrl}/api/stories/${id}`;

  const response = await fetch(url, {
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch story by ID');
  }

  const data = (await response.json()) as ApiResponse<Question>;

  return data;
};
