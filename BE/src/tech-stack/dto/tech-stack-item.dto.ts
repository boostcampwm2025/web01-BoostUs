import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';

export class TechStackItemDto {
  @ApiProperty({
    description: '기술 스택 ID',
    example: 1,
  })
  @Expose()
  @Transform(({ value }) => Number(value))
  id: number;

  @ApiProperty({
    description: '기술 스택 카테고리',
    example: 'FRONTEND',
    enum: ['FRONTEND', 'BACKEND', 'DATABASE', 'INFRA', 'MOBILE', 'ETC'],
  })
  @Expose()
  category: string;

  @ApiProperty({
    description: '기술 스택 이름',
    example: 'React',
  })
  @Expose()
  name: string;
}
