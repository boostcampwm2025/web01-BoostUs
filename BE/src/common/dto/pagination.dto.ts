import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

/**
 * 페이지네이션 메타 정보
 */
export class PaginationMetaDto {
  @Expose()
  @ApiPropertyOptional({
    description: '다음 페이지 커서',
    example: 'eyJzb3J0IjoiTEFURVNUIiwidiI6IjIwMjQtMDEtMTlUMTI6MDA6MDBaIiwiaWQiOiIxIn0',
  })
  nextCursor: string | null;

  @Expose()
  @ApiPropertyOptional({
    description: '다음 페이지 존재 여부',
    example: true,
  })
  hasNextPage: boolean;

  @Expose()
  @ApiPropertyOptional({
    description: '페이지 크기',
    example: 10,
  })
  pageSize: number;
}

/**
 * 페이지네이션된 목록 응답 데이터
 */
export class PaginatedDataDto<T> {
  /** 항목 목록 */
  @Expose()
  @ApiProperty({
    description: '항목 목록',
    type: [Object],
  })
  items: T[];

  /** 페이지네이션 메타 정보 */
  @Expose()
  @ApiProperty({
    description: '페이지네이션 메타 정보',
    type: PaginationMetaDto,
  })
  meta: PaginationMetaDto;
}
