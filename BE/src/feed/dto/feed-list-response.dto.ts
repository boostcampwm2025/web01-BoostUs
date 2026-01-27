import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { FeedListItemDto } from './feed-list-item.dto';

/**
 * Feed List Response DTO
 */
export class FeedListResponseDto {
  @ApiProperty({
    description: 'RSS 피드 목록',
    type: [FeedListItemDto],
  })
  @Expose()
  @Type(() => FeedListItemDto)
  items: FeedListItemDto[];
}
