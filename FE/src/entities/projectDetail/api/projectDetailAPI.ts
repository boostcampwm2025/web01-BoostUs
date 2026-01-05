import { MOCK_PROJECT_DETAIL } from '@/entities/projectDetail/config/mockData'; // 위에서 만든 데이터 import
import { ProjectResponse } from '@/entities/projectDetail/model/types';

// 1초 뒤에 데이터를 반환하는 가짜 비동기 함수
export const fetchMockProjectDetail = (): Promise<ProjectResponse> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_PROJECT_DETAIL);
    }, 500);
  });
};
