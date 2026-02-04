import {
  Question,
  QuestionsStatusFilter,
} from '@/features/questions/model/questions.type';
import { ApiResponse } from '@/shared/types/ApiResponseType';
import { Meta } from '@/shared/types/PaginationType';
import { customFetch } from '@/shared/utils/fetcher';

export interface FetchQnaMainParams {
  status?: QuestionsStatusFilter; // 'all' | 'unanswered' | 'unsolved' | 'solved'
  size?: number;
  skipStore?: boolean;
}

export const MAIN_QNA_KEY = ['main-qna'];

export const fetchQnaMain = async ({
  status = 'all',
  size = 3,
  skipStore,
}: FetchQnaMainParams) => {
  const searchParams = new URLSearchParams();

  // 1. 상태 필터 (전체가 아닐 경우에만 파라미터 추가)
  if (status && status !== 'all') {
    searchParams.append('status', status.toUpperCase());
  }

  // 2. 개수 제한 (기본값 3)
  searchParams.append('size', size.toString());

  // 3. 정렬 기준 (메인은 무조건 최신순 고정)
  searchParams.append('sort', 'LATEST');

  // 4. 페이지 (Offset Pagination 호환용, 1페이지 고정)
  searchParams.append('page', '1');

  const queryString = searchParams.toString();
  const path = queryString ? `/api/questions?${queryString}` : `/api/questions`;

  return await customFetch<
    ApiResponse<{
      items: Question[];
      meta: Meta;
    }>
  >(path, { skipStore });
};
