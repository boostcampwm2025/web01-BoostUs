import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export enum QuestionStatus {
  ALL = 'ALL',
  UNANSWERED = 'UNANSWERED',
  UNSOLVED = 'UNSOLVED',
  SOLVED = 'SOLVED',
}

export enum QuestionSort {
  LATEST = 'LATEST',
  LIKES = 'LIKES',
  VIEWS = 'VIEWS',
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
    description:
      '커서(base64url). 이전 응답의 meta.nextCursor 값을 그대로 넣으면 다음 페이지를 가져옵니다.',
    example: 'eyJzb3J0IjoiTEFURVNUIiwidiI6IjIwMjYtMDEtMjBUMDY6MDA6MDAuMDAwWiIsImlkIjoiMTIzIn0',
  })
  @IsOptional()
  @Type(() => String)
  @IsString()
  cursor?: string;

  // (선택) 기존 offset pagination 호환용: FE가 아직 page/size를 쓰면 남겨두기
  // cursor가 오면 page/size는 무시하도록 service에서 처리하면 됨
  @ApiPropertyOptional({
    description: '[호환용] offset pagination 페이지 번호 (cursor가 있으면 무시)',
    example: 1,
    default: 1,
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({
    description: '[호환용] offset pagination size (cursor가 있으면 무시)',
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
  size?: number;
}
