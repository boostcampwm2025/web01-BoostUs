import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayUnique, IsArray, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class ProjectListQueryDto {
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
  page?: number = 1;

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
  size?: number = 10;

  @ApiPropertyOptional({
    description: '부스트캠프 기수 필터',
    example: 10,
    minimum: 1,
    maximum: 100,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  cohort?: number;

  @ApiPropertyOptional({
    description: '기술 스택 필터 (여러 개 가능)',
    example: ['React', 'NestJS'],
    type: [String],
  })
  // GET /api/projects?stack=react&stack=nestjs
  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsString({ each: true })
  stack?: string[];
}
