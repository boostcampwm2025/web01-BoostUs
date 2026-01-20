import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { StoryBaseDto } from './story-base.dto';

/**
 * Story 목록 항목 DTO
 * GET /stories (목록 조회)
 */
export class StoryListItemDto extends StoryBaseDto {
  @ApiProperty({
    description: '스토리 요약',
    example: '이번 프로젝트를 진행하면서 배운 점과 느낀 점을 정리했습니다...',
  })
  @Expose()
  summary: string;
}
