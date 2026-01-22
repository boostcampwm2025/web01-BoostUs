// 1. 개별 기술 스택 아이템을 위한 인터페이스 정의
export interface TechStackItem {
  id: number;
  name: string;
}

// 2. 전체 응답 구조를 위한 인터페이스 정의
export interface TechStackResponse {
  FRONTEND: TechStackItem[];
  BACKEND: TechStackItem[];
  DATABASE: TechStackItem[];
  INFRA: TechStackItem[];
  MOBILE: TechStackItem[];
  ETC: TechStackItem[];
  [key: string]: TechStackItem[];
}
