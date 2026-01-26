import {
  Question,
  QuestionsStatusFilter,
} from '@/features/questions/model/questions.type';
import { ApiResponse } from '@/shared/types/ApiResponseType';
import { Meta } from '@/shared/types/PaginationType';
import { customFetch } from '@/shared/utils/fetcher';

interface FetchQnaMainParams {
  status?: QuestionsStatusFilter; // 'all' | 'unanswered' | 'unsolved' | 'solved'
  size?: number;
}

export const fetchQnaMain = async ({
  status = 'all',
  size = 3,
}: FetchQnaMainParams) => {
  const searchParams = new URLSearchParams();

  // 1. 상태 필터 (전체가 아닐 경우에만 파라미터 추가)
  if (status && status !== 'all') {
    searchParams.append('status', status.toUpperCase());
  }

  // 2. 개수 제한 (기본값 3)
  // 명세에 따라 limit 대신 호환용 size를 사용합니다.
  searchParams.append('size', size.toString());

  // 3. 정렬 기준 (메인은 무조건 최신순 고정)
  searchParams.append('sort', 'LATEST');

  // 4. 페이지 (Offset Pagination 호환용, 1페이지 고정)
  searchParams.append('page', '1');

  const queryString = searchParams.toString();
  const path = queryString ? `/api/questions?${queryString}` : `/api/questions`;

  // 필요에 따라 { next: { revalidate: 60 } } 등으로 조절
  const response = await customFetch<
    ApiResponse<{
      items: Question[];
      meta: Meta;
    }>
  >(path, { cache: 'no-store' });

  return response;
};
