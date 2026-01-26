import { Expose } from 'class-transformer';

/**
 * Feed 상세 정보 DTO
 */
export class FeedDetailDto {
  @Expose()
  id: bigint;

  @Expose()
  feedUrl: string;

  @Expose()
  memberId: bigint;

  @Expose()
  state: string;

  @Expose()
  createdAt: Date;

  @Expose()
  lastFetchedAt: Date;
}
