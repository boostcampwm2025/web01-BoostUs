// src/question/dto/req/create-question.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ArrayMaxSize, IsArray, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateQuestionDto {
  @ApiProperty({
    description: '질문 제목',
    example: 'NestJS에서 Prisma를 사용하는 방법은?',
    minLength: 1,
    maxLength: 200,
  })
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  title!: string;

  @ApiProperty({
    description: '질문 내용 (마크다운)',
    example: '# 질문\n\nNestJS에서 Prisma를 설정하는 방법을 알고 싶습니다.',
    minLength: 1,
  })
  @IsString()
  @MinLength(1)
  contents!: string; // markdown

  @ApiPropertyOptional({
    description: '해시태그 목록 (최대 10개, 각 30자 이내)',
    example: ['NestJS', 'Prisma', 'TypeScript'],
    type: [String],
    maxItems: 10,
  })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(10)
  @IsString({ each: true })
  @MaxLength(30, { each: true })
  hashtags?: string[];
}
