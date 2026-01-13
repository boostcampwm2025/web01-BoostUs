/**
 * 페이지네이션 메타 정보
 */
export class PaginationMetaDto {
  // TODO: 페이지네이션 메타 정보 추가
}

/**
 * 페이지네이션된 목록 응답 데이터
 */
export class PaginatedDataDto<T> {
  /** 항목 목록 */
  items: T[];

  /** 페이지네이션 메타 정보 */
  meta: PaginationMetaDto;
}
