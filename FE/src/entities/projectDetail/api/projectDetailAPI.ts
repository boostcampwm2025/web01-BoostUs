import { ProjectResponse } from '@/entities/projectDetail/model/types';

// 1초 뒤에 데이터를 반환하는 가짜 비동기 함수
export const fetchMockProjectDetail = ({
  id,
}: {
  id: number;
}): Promise<ProjectResponse> => {
  return fetch(`/api/projects/${String(id)}`).then((res) => res.json());
};
