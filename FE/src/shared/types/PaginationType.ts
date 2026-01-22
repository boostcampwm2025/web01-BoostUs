export interface Meta {
  size?: number;
  pageSize?: number;
  nextCursor: Base64URLString | null;
  prevCursor: Base64URLString | null;
  hasNext?: boolean;
  hasNextPage?: boolean;
}
