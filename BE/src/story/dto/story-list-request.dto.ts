import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
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
}
