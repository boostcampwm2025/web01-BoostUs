import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ProjectParticipantDto {
  @ApiProperty({
    description: 'GitHub ID',
    example: 'octocat',
  })
  @Expose()
  githubId: string;

  @ApiProperty({
    description: '프로필 이미지 URL',
    example: 'https://avatars.githubusercontent.com/u/583231',
    nullable: true,
  })
  @Expose()
  avatarUrl: string | null;
}
