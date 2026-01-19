import { Expose, Type } from 'class-transformer';
import { FeedListItemDto } from './feed-list-item.dto';

/**
 * Feed List Response DTO
 */
export class FeedListResponseDto {
  @Expose()
  @Type(() => FeedListItemDto)
  items: FeedListItemDto[];
}
