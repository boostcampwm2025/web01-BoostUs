import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';
import { ProjectField } from '../type/project-field.type';

export class ProjectListQueryDto {
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
    description: '프로젝트 분야 필터',
    example: 'WEB',
    enum: ProjectField,
  })
  @IsOptional()
  @IsEnum(ProjectField)
  field?: ProjectField;
}
