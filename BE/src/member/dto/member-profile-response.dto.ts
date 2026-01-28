import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { FeedUrlDto } from './feed-url.dto';
import { LatestProjectDto } from './latest-project.dto';
import { MemberProfileDto } from './member-profile.dto';

export class MemberProfileResponseDto {
  @ApiProperty({
    description: '멤버 기본 정보',
    type: MemberProfileDto,
  })
  @Expose()
  @Type(() => MemberProfileDto)
  member: MemberProfileDto;

  @ApiProperty({
    description: '가장 최근에 등록된 프로젝트 정보 (github_id와 일치하는 프로젝트 중)',
    type: LatestProjectDto,
    nullable: true,
  })
  @Expose()
  @Type(() => LatestProjectDto)
  latestProject: LatestProjectDto | null;

  @ApiProperty({
    description: 'RSS 피드 URL 정보',
    type: FeedUrlDto,
    nullable: true,
  })
  @Expose()
  @Type(() => FeedUrlDto)
  feed: FeedUrlDto | null;
}
