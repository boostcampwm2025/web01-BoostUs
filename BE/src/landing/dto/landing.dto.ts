import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';

/**
 * 랜딩 페이지 통계 응답 DTO
 */
export class LandingDto {
  @ApiProperty({
    description: '전체 가입자 수',
    example: 1,
  })
  @Expose()
  @Transform(({ value }) => Number(value))
  memberCnt: number;

  @ApiProperty({
    description: '전체 프로젝트 개수',
    example: 5,
  })
  @Expose()
  @Transform(({ value }) => Number(value))
  projectCnt: number;

  @ApiProperty({
    description: '전체 이야기 개수',
    example: 10,
  })
  @Expose()
  @Transform(({ value }) => Number(value))
  storyCnt: number;
}
