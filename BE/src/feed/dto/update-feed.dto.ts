import { ApiProperty } from '@nestjs/swagger';
import { IsUrl } from 'class-validator';

/**
 * RSS Feed 수정 DTO
 */
export class UpdateFeedDto {
  @ApiProperty({
    description: 'RSS 피드 URL',
    example: 'https://v2.velog.io/rss/@username',
  })
  @IsUrl({}, { message: '유효한 RSS 피드 URL을 입력해주세요.' })
  feedUrl: string;
}
