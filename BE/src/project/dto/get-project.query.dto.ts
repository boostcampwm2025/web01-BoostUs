import { IsInt, IsOptional, IsString } from 'class-validator';

export class GetProjectQueryDto {
  @IsOptional()
  @IsString({ each: true })
  stack?: string[];

  @IsOptional()
  @IsInt()
  cohort?: number;
}
