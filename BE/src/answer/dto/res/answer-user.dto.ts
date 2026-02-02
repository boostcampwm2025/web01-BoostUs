import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class AnswerUserDto {
  @ApiProperty({
    description: '사용자 ID',
    example: '1',
  })
  @Expose()
  id!: string;

  @ApiProperty({
    description: '닉네임',
    example: '윌리',
  })
  @Expose()
  nickname!: string;

  @ApiProperty({
    description: '프로필 이미지 URL',
    example: 'https://example.com/avatar.jpg',
    nullable: true,
  })
  @Expose()
  avatarUrl!: string | null;

  @ApiProperty({
    description: '기수',
    example: 10,
    nullable: true,
  })
  @Expose()
  cohort!: number | null;
}
