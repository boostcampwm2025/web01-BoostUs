import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { Role } from 'src/generated/prisma/enums';

export class MemberProfileDto {
  @Expose()
  id: bigint;

  @ApiProperty({
    description: '프로필 이미지 URL',
    example: 'https://example.com/avatar.jpg',
    nullable: true,
  })
  @Expose()
  avatarUrl: string | null;

  @ApiProperty({
    description: '깃허브 로그인 ID',
    example: 'octocat',
    nullable: true,
  })
  @Expose()
  githubLogin: string | null;

  @ApiProperty({
    description: '닉네임',
    example: '부스트캠퍼',
  })
  @Expose()
  nickname: string;

  @ApiProperty({
    description: '기수',
    example: 10,
    nullable: true,
  })
  @Expose()
  cohort: number | null;

  @ApiProperty({
    description: '역할',
    example: Role.MEMBER,
    enum: Role,
    nullable: true,
  })
  @Expose()
  role?: Role | null;
}
