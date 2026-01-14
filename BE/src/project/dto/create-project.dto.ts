import { Type } from 'class-transformer';
import {
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  Min,
  IsArray,
  ValidateNested,
} from 'class-validator';

class CreateProjectParticipantDto {
  @IsString()
  githubId: string;

  @IsOptional()
  @IsUrl()
  avatarUrl?: string;
}

export class CreateProjectDto {
  @IsOptional()
  @IsUrl()
  thumbnailUrl?: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  contents?: string;

  @IsUrl()
  repoUrl: string;

  @IsOptional()
  @IsUrl()
  demoUrl?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  cohort?: number;

  @IsArray()
  @IsInt({ each: true })
  techStack: number[];

  @IsOptional()
  @IsDateString()
  startDate?: string; // YYYY-MM-DD 들어와도 DateString 통과

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsString()
  field: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateProjectParticipantDto)
  participants?: CreateProjectParticipantDto[];
}
