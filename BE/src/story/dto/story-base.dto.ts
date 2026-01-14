import { Expose, Type } from 'class-transformer';
import { MemberDto } from '../../member/dto/member.dto';

/**
 * Story Base DTO - 공통 필드
 */
export class StoryBaseDto {
  @Expose()
  id: bigint;

  @Expose()
  title: string;

  @Expose()
  thumbnailUrl: string | null;

  @Expose()
  originalUrl: string | null;

  @Expose()
  likeCount: number;

  @Expose()
  viewCount: number;

  @Expose()
  createdAt: Date;

  @Expose()
  @Type(() => MemberDto)
  member: MemberDto;
}
