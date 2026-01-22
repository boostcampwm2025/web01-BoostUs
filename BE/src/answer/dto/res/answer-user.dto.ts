import { ApiProperty } from '@nestjs/swagger';

export class AnswerUserDto {
  @ApiProperty({
    description: '사용자 ID',
    example: '1',
  })
  id!: string; // BigInt → string

  @ApiProperty({
    description: '닉네임',
    example: '윌리',
  })
  nickname!: string;

  @ApiProperty({
    description: '프로필 이미지 URL',
    example: 'https://example.com/avatar.jpg',
    nullable: true,
  })
  avatarUrl!: string | null;

  @ApiProperty({
    description: '기수',
    example: 10,
    nullable: true,
  })
  cohort!: number | null;
}
