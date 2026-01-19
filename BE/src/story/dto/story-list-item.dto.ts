import { Expose } from 'class-transformer';
import { StoryBaseDto } from './story-base.dto';

/**
 * Story 목록 항목 DTO
 * GET /stories (목록 조회)
 */
export class StoryListItemDto extends StoryBaseDto {
  @Expose()
  summary: string;
}
