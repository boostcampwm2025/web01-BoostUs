import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  Min,
} from 'class-validator';
import { ProjectField } from '../type/project-field.type';

export class CreateProjectDto {
  @ApiProperty({
    description: '프로젝트 제목',
    example: '부스트 캠프 최종 프로젝트',
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'GitHub 저장소 URL',
    example: 'https://github.com/username/repository',
  })
  @IsUrl()
  repoUrl: string;

  @ApiPropertyOptional({
    description:
      '썸네일 이미지 식별자(uploadId). POST /projects/uploads/thumbnails 응답의 uploadId 를 그대로 사용하면 됩니다.',
    example: 'cc67be56-9026-4600-8444-b9c1fe399cf0',
  })
  @IsOptional()
  @IsString()
  thumbnailUploadId?: string;

  @ApiPropertyOptional({
    description:
      '썸네일 이미지 미리보기 URL. POST /projects/uploads/thumbnails 응답의 thumbnailUrl 을 그대로 사용하면 됩니다. ',
    example: 'temp/projects/thumbnail/cc67be56-9026-4600-8444-b9c1fe399cf0.png',
  })
  @IsOptional()
  @Transform(({ value }: { value: unknown }) => (value === '' ? undefined : value))
  @IsUrl()
  thumbnailUrl?: string;

  @ApiPropertyOptional({
    description: '프로젝트 설명',
    example: '팀 협업 프로젝트 관리 서비스',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: '프로젝트 상세 내용',
    example: '# 프로젝트 소개\n\n팀원들과 함께...',
  })
  @IsOptional()
  @IsString()
  contents?: string;

  @ApiPropertyOptional({
    description: '데모/배포 URL',
    example: 'https://project-demo.com',
  })
  @IsOptional()
  @Transform(({ value }: { value: unknown }) => (value === '' ? null : value))
  @IsUrl()
  demoUrl?: string;

  @ApiPropertyOptional({
    description: '부스트캠프 기수',
    example: 10,
    minimum: 1,
    maximum: 100,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  cohort?: number;

  @ApiPropertyOptional({
    description: '기술 스택 이름 목록',
    example: ['React', 'NestJS', 'TypeScript'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  techStack?: string[];

  @ApiPropertyOptional({
    description: '프로젝트 시작일 (YYYY-MM-DD)',
    example: '2024-01-01',
  })
  @IsOptional()
  @IsDateString()
  startDate?: string; // YYYY-MM-DD 들어와도 DateString 통과

  @ApiPropertyOptional({
    description: '프로젝트 종료일 (YYYY-MM-DD)',
    example: '2024-02-28',
  })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiPropertyOptional({
    description: '프로젝트 분야',
    example: 'WEB',
    enum: ProjectField,
  })
  @IsOptional()
  @IsEnum(ProjectField)
  field?: ProjectField;

  @ApiPropertyOptional({
    description: '프로젝트 참여자 GitHub ID 목록',
    type: [String],
    example: ['octocat', 'user2', 'user3'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  participants?: string[];
}
