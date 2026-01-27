import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

/**
 * Feed List Item DTO
 */
export class FeedListItemDto {
  @ApiProperty({
    description: 'RSS 피드 ID',
    example: 1,
  })
  @Expose()
  id: bigint;

  @ApiProperty({
    description: 'RSS 피드 URL',
    example: 'https://v2.velog.io/rss/@username',
  })
  @Expose()
  feedUrl: string;

  @ApiProperty({
    description: '멤버 ID',
    example: 1,
  })
  @Expose()
  memberId: bigint;

  @ApiProperty({
    description: '마지막 수집일시',
    example: '2024-01-19T12:00:00Z',
  })
  @Expose()
  lastFetchedAt: Date;

  @ApiProperty({
    description: '피드 상태',
    example: 'ACTIVE',
    enum: ['ACTIVE', 'INACTIVE'],
  })
  @Expose()
  state: string;
}
