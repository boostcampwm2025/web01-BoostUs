export interface Meta {
  size: number;
  nextCursor: Base64URLString | null;
  prevCursor: Base64URLString | null;
  hasNext: boolean;
}

export interface PaginationState {
  // 페이지 번호: 해당 페이지를 불러올 때 썼던 커서
  // e.g. { 1: null, 2: "cursor_string_A", 3: "cursor_string_B" }
  currentPage: number;
  pageCursors: Record<number, Base64URLString | null>;
}
