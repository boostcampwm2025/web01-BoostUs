import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class FeedUrlDto {
  @ApiProperty({
    description: 'RSS 피드 URL',
    example: 'https://example.com/feed.xml',
  })
  @Expose()
  feedUrl: string;
}
