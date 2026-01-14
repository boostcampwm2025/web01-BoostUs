import { Expose } from 'class-transformer';
import { StoryBaseDto } from './story-base.dto';

/**
 * Story 상세 조회 응답 DTO
 * GET /stories/:id
 */
export class StoryResponseDto extends StoryBaseDto {
  @Expose()
  contents: string;
}
