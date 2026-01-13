import { Type } from 'class-transformer';
import { IsDateString, IsInt, IsOptional, IsString, IsUrl, Max, Min } from 'class-validator';

export class CreateProjectDto {
  @IsString()
  name: string;

  @IsUrl()
  repoUrl: string;

  @IsOptional()
  @IsString()
  oneLineIntro?: string;

  @IsOptional()
  @IsString()
  thumbnailUrl?: string;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  teamNumber?: number;

  @IsOptional()
  @IsString()
  teamName?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(127)
  cohort?: number;

  @IsOptional()
  @IsString()
  field?: string; // Web/iOS/Android

  @IsOptional()
  @IsUrl()
  demoUrl?: string;

  @IsOptional()
  @IsString()
  contents?: string; // markdown
}
