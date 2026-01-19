import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Min, Max } from 'class-validator';
export enum QuestionStatus {
  ALL = 'ALL',
  UNANSWERED = 'UNANSWERED',
}

export enum QuestionSort {
  LATEST = 'LATEST',
  POPULAR = 'POPULAR',
}

export class QuestionQueryDto {
  @IsOptional()
  @IsEnum(QuestionStatus)
  status: QuestionStatus = QuestionStatus.ALL;

  @IsOptional()
  @IsEnum(QuestionSort)
  sort: QuestionSort = QuestionSort.LATEST;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  size: number = 10;
}
