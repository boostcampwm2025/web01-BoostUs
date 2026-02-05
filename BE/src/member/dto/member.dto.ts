import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { Role } from 'src/generated/prisma/enums';

export class MemberDto {
  @ApiProperty({
    description: '멤버 ID',
    example: '1',
    type: 'string',
  })
  @Expose()
  id: bigint;

  @ApiProperty({
    description: '닉네임',
    example: '윌리',
  })
  @Expose()
  nickname: string;

  @ApiProperty({
    description: '프로필 이미지 URL',
    example: 'https://example.com/avatar.jpg',
    nullable: true,
  })
  @Expose()
  avatarUrl: string | null;

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
  })
  @Expose()
  role?: Role | null;
}
