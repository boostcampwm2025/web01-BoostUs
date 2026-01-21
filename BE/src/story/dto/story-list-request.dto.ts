import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { StoryPeriod, StorySortBy } from '../type/story-query.type';

/**
 * Story 목록 조회 요청 DTO
 */
export class StoryListRequestDto {
  @ApiPropertyOptional({
    description: '정렬 기준',
    enum: StorySortBy,
    default: StorySortBy.LATEST,
    example: StorySortBy.LATEST,
  })
  @IsOptional()
  @IsEnum(StorySortBy)
  sortBy: StorySortBy = StorySortBy.LATEST;

  @ApiPropertyOptional({
    description: '집계 기간',
    enum: StoryPeriod,
    default: StoryPeriod.ALL,
    example: StoryPeriod.ALL,
  })
  @IsOptional()
  @IsEnum(StoryPeriod)
  period: StoryPeriod = StoryPeriod.ALL;

  @ApiPropertyOptional({
    description: '한 번에 가져올 개수',
    example: 20,
    default: 20,
    minimum: 1,
    maximum: 100,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  size: number;

  @ApiPropertyOptional({
    description:
      '커서(base64url). 이전 응답의 meta.nextCursor 값을 그대로 넣으면 다음 페이지를 가져옵니다.',
  })
  @IsOptional()
  @IsString()
  cursor?: string;
}
