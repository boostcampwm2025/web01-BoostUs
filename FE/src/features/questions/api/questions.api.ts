import {
  Answer,
  Question,
  QuestionCounts,
  QuestionDetail,
  QuestionsSortBy,
  QuestionsStatusFilter,
} from '@/features/questions/model/questions.type';
import { ApiResponse } from '@/shared/types/ApiResponseType';
import { Meta } from '@/shared/types/PaginationType';
import { customFetch } from '@/shared/utils/fetcher';

/**
 * 초기 질문 목록 조회
 */
export const getInitialQuestions = async (params?: {
  status?: QuestionsStatusFilter;
  sort?: QuestionsSortBy;
}) => {
  const status = params?.status === 'all' ? undefined : params?.status;

  return await customFetch<
    ApiResponse<{
      items: Question[];
      meta: Meta;
    }>
  >('/api/questions', {
    params: {
      status,
      sort: params?.sort,
    },
    cache: 'no-store',
  });
};

/**
 * 특정 질문 상세 조회
 */
export const getQuestionById = async (id: string) => {
  const data = await customFetch<
    ApiResponse<{
      question: QuestionDetail;
      answers: Answer[];
    }>
  >(`/api/questions/${id}`, { cache: 'no-store' });

  return data.data;
};

/**
 * 커서 기반 질문 목록 조회
 */
export const fetchQuestionsByCursor = async (
  cursor: Base64URLString | null
) => {
  const searchParams = new URLSearchParams(window.location.search);

  const params = Object.fromEntries(searchParams.entries());

  if (params.status === 'all') delete params.status;
  if (cursor) params.cursor = cursor;
  else delete params.cursor;

  const response = await customFetch<
    ApiResponse<{
      items: Question[];
      meta: Meta;
    }>
  >('/api/questions', {
    params,
    cache: 'no-store',
  });

  return response.data;
};

export const getQuestionCounts = async () => {
  const response = await customFetch<ApiResponse<QuestionCounts>>(
    `/api/questions/count`,
    { cache: 'no-store' }
  );
  return response.data;
};

export const createQuestion = async (
  memberId: string,
  body: {
    title: string;
    contents: string;
    hashtags?: string[];
  }
) => {
  const data = await customFetch<ApiResponse<QuestionDetail>>(
    `/api/questions`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        memberId,
      },
      body: JSON.stringify(body),
    }
  );

  return data.data;
};

export const createAnswer = async (
  memberId: string,
  questionId: string,
  body: {
    contents: string;
  }
) => {
  const data = await customFetch<ApiResponse<QuestionDetail>>(
    `/api/answers/${questionId}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        memberId,
      },
      body: JSON.stringify(body),
    }
  );

  return data.data;
};
