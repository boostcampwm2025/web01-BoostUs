import { IsEnum, IsOptional } from 'class-validator';
import { StoryPeriod, StorySortBy } from '../type/story-query.type';

/**
 * Story 목록 조회 요청 DTO
 */
export class StoryListRequestDto {
  @IsOptional()
  @IsEnum(StorySortBy)
  sortBy: StorySortBy = StorySortBy.LATEST;

  @IsOptional()
  @IsEnum(StoryPeriod)
  period: StoryPeriod = StoryPeriod.ALL;
}
