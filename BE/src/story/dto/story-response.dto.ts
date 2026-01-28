import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { StoryBaseDto } from './story-base.dto';

/**
 * Story 상세 조회 응답 DTO
 * GET /stories/:id
 */
export class StoryResponseDto extends StoryBaseDto {
  @ApiProperty({
    description: '스토리 본문 내용',
    example: '# 프로젝트 회고\n\n이번 프로젝트를 진행하면서...',
  })
  @Expose()
  contents: string;

  @ApiProperty({
    description: '현재 로그인한 사용자가 좋아요한 여부',
    example: true,
    default: false,
  })
  @Expose()
  isLikedByMe: boolean;
}
