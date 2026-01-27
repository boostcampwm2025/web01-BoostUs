import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUrl } from 'class-validator';

/**
 * RSS Feed 생성 DTO
 */
export class CreateFeedDto {
  @ApiProperty({
    description: 'RSS 피드 URL',
    example: 'https://v2.velog.io/rss/@username',
  })
  @IsNotEmpty({ message: 'RSS 피드 URL을 입력해주세요.' })
  @IsUrl({}, { message: '유효한 RSS 피드 URL을 입력해주세요.' })
  feedUrl: string;
}
