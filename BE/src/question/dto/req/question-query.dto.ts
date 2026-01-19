import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';
export enum QuestionStatus {
  ALL = 'ALL',
  UNANSWERED = 'UNANSWERED',
}

export enum QuestionSort {
  LATEST = 'LATEST',
  POPULAR = 'POPULAR',
}

export class QuestionQueryDto {
  @ApiPropertyOptional({
    description: '질문 상태 필터',
    enum: QuestionStatus,
    default: QuestionStatus.ALL,
    example: QuestionStatus.ALL,
  })
  @IsOptional()
  @IsEnum(QuestionStatus)
  status: QuestionStatus = QuestionStatus.ALL;

  @ApiPropertyOptional({
    description: '정렬 기준',
    enum: QuestionSort,
    default: QuestionSort.LATEST,
    example: QuestionSort.LATEST,
  })
  @IsOptional()
  @IsEnum(QuestionSort)
  sort: QuestionSort = QuestionSort.LATEST;

  @ApiPropertyOptional({
    description: '페이지 번호',
    example: 1,
    default: 1,
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @ApiPropertyOptional({
    description: '페이지당 항목 수',
    example: 10,
    default: 10,
    minimum: 1,
    maximum: 100,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  size: number = 10;
}
