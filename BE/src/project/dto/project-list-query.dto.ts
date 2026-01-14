import { Type } from 'class-transformer';
import { ArrayUnique, IsArray, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class ProjectListQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  size?: number = 10;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  cohort?: number;

  // GET /api/projects?stack=react&stack=nestjs
  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsString({ each: true })
  stack?: string[];
}
