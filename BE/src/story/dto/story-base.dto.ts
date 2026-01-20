import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { MemberDto } from '../../member/dto/member.dto';

/**
 * Story Base DTO - 공통 필드
 */
export class StoryBaseDto {
  @ApiProperty({
    description: '스토리 ID',
    example: '1',
    type: 'string',
  })
  @Expose()
  id: bigint;

  @ApiProperty({
    description: '스토리 제목',
    example: '프로젝트 회고록',
  })
  @Expose()
  title: string;

  @ApiProperty({
    description: '썸네일 이미지 URL',
    example: 'https://example.com/thumbnail.jpg',
    nullable: true,
  })
  @Expose()
  thumbnailUrl: string | null;

  @ApiProperty({
    description: '원본 URL',
    example: 'https://example.com/story/1',
    nullable: true,
  })
  @Expose()
  originalUrl: string | null;

  @ApiProperty({
    description: '좋아요 수',
    example: 42,
  })
  @Expose()
  likeCount: number;

  @ApiProperty({
    description: '조회수',
    example: 150,
  })
  @Expose()
  viewCount: number;

  @ApiProperty({
    description: '생성일시',
    example: '2024-01-19T12:00:00Z',
  })
  @Expose()
  createdAt: Date;

  @ApiProperty({
    description: '작성자 정보',
    type: () => MemberDto,
  })
  @Expose()
  @Type(() => MemberDto)
  member: MemberDto;
}
