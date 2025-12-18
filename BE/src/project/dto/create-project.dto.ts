import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  ValidateNested,
} from 'class-validator';

class ProjectMemberDto {
  @IsString()
  @MaxLength(255)
  nickname: string;

  @IsOptional()
  @IsUrl()
  avatarUrl?: string;
}

export class CreateProjectDto {
  @IsOptional()
  @IsUrl()
  thumbnailUrl?: string;

  @IsString()
  @MaxLength(255)
  title: string; // required

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  summary?: string;

  @IsOptional()
  @IsString()
  contents?: string;

  @IsUrl()
  repositoryUrl: string; // required

  @IsOptional()
  @IsUrl()
  demoUrl?: string;

  @IsOptional()
  @IsInt()
  cohort?: number;

  @IsOptional()
  @IsDateString()
  startDate?: string; // YYYY-MM-DD

  @IsOptional()
  @IsDateString()
  endDate?: string; // YYYY-MM-DD

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProjectMemberDto)
  members?: ProjectMemberDto[];
}
