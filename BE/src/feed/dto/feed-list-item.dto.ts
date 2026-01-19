import { Expose } from 'class-transformer';

/**
 * Feed List Item DTO
 */
export class FeedListItemDto {
  @Expose()
  id: bigint;

  @Expose()
  feedUrl: string;

  @Expose()
  memberId: bigint;

  @Expose()
  lastFetchedAt: Date;

  @Expose()
  state: string;
}
