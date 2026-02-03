import {
  TechStackItem,
  TechStackResponse,
} from '@/entities/TechStackSelector/model/types';

export const normalizeStacks = (data: unknown): TechStackResponse => {
  const empty: TechStackResponse = {
    FRONTEND: [],
    BACKEND: [],
    DATABASE: [],
    INFRA: [],
    MOBILE: [],
    ETC: [],
  };

  if (Array.isArray(data)) {
    return { ...empty, ETC: data as TechStackItem[] };
  }

  if (data && typeof data === 'object') {
    const obj = data as Partial<TechStackResponse>;
    return {
      FRONTEND: obj.FRONTEND ?? [],
      BACKEND: obj.BACKEND ?? [],
      DATABASE: obj.DATABASE ?? [],
      INFRA: obj.INFRA ?? [],
      MOBILE: obj.MOBILE ?? [],
      ETC: obj.ETC ?? [],
    };
  }

  return empty;
};
