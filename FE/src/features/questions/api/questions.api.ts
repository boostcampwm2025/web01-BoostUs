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

export const getInitialQuestions = async (params?: {
  status?: QuestionsStatusFilter;
  sort?: QuestionsSortBy;
}) => {
  const searchParams = new URLSearchParams();

  if (params?.status && params.status !== 'all') {
    searchParams.append('status', params.status.toUpperCase());
  }

  if (params?.sort) {
    searchParams.append('sort', params.sort.toUpperCase());
  }

  const queryString = searchParams.toString();
  const path = queryString ? `/api/questions?${queryString}` : `/api/questions`;

  const data = await customFetch<
    ApiResponse<{
      items: Question[];
      meta: Meta;
    }>
  >(path, { cache: 'no-store' });

  return data;
};

export const getQuestionById = async (id: string) => {
  const data = await customFetch<
    ApiResponse<{
      question: QuestionDetail;
      answers: Answer[];
    }>
  >(`/api/questions/${id}`, { cache: 'no-store' });

  return data.data;
};

export const fetchQuestionsByCursor = async (
  cursor: Base64URLString | null
) => {
  const currentParams = new URLSearchParams(window.location.search);

  const statusParam = currentParams.get('status');
  if (statusParam) {
    if (statusParam === 'all') {
      currentParams.delete('status');
    } else {
      currentParams.set('status', statusParam.toUpperCase());
    }
  }

  const sortParam = currentParams.get('sort');
  if (sortParam) {
    currentParams.set('sort', sortParam.toUpperCase());
  }

  currentParams.delete('cursor');
  if (cursor) {
    currentParams.append('cursor', cursor);
  }

  const data = await customFetch<
    ApiResponse<{
      items: Question[];
      meta: Meta;
    }>
  >(`/api/questions?${currentParams.toString()}`, { cache: 'no-store' });

  return data.data;
};

export const getQuestionCounts = async () => {
  const data = await customFetch<ApiResponse<QuestionCounts>>(
    `/api/questions/count`,
    { cache: 'no-store' }
  );
  return data.data;
};
