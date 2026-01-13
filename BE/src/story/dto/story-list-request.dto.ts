import { IsIn, IsOptional } from 'class-validator';
import {
  STORY_PERIOD,
  STORY_PERIOD_VALUES,
  STORY_SORT_BY,
  STORY_SORT_BY_VALUES,
  type StoryPeriod,
  type StorySortBy,
} from '../type/story-query.type';

/**
 * Story 목록 조회 요청 DTO
 */
export class StoryListRequestDto {
  @IsOptional()
  @IsIn(STORY_SORT_BY_VALUES)
  sortBy: StorySortBy = STORY_SORT_BY.LATEST;

  @IsOptional()
  @IsIn(STORY_PERIOD_VALUES)
  period: StoryPeriod = STORY_PERIOD.ALL;
}
