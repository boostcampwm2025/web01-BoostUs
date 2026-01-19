import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';

class CreateProjectParticipantDto {
  @ApiProperty({
    description: 'GitHub ID',
    example: 'octocat',
  })
  @IsString()
  githubId: string;

  @ApiPropertyOptional({
    description: '프로필 이미지 URL',
    example: 'https://avatars.githubusercontent.com/u/583231',
  })
  @IsOptional()
  @IsUrl()
  avatarUrl?: string;
}

export class CreateProjectDto {
  @ApiPropertyOptional({
    description: '썸네일 이미지 URL',
    example: 'https://example.com/thumbnail.jpg',
  })
  @IsOptional()
  @IsUrl()
  thumbnailUrl?: string;

  @ApiPropertyOptional({
    description: '프로젝트 제목',
    example: '부스트 캠프 최종 프로젝트',
  })
  @IsOptional()
  @IsString()
  title?: string;

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

  @ApiProperty({
    description: 'GitHub 저장소 URL',
    example: 'https://github.com/username/repository',
  })
  @IsUrl()
  repoUrl: string;

  @ApiPropertyOptional({
    description: '데모/배포 URL',
    example: 'https://project-demo.com',
  })
  @IsOptional()
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

  @ApiProperty({
    description: '기술 스택 ID 목록',
    example: [1, 2, 3],
    type: [Number],
  })
  @IsArray()
  @IsInt({ each: true })
  techStack: number[];

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
    example: 'Web',
  })
  @IsOptional()
  @IsString()
  field: string;

  @ApiPropertyOptional({
    description: '프로젝트 참여자 목록',
    type: [CreateProjectParticipantDto],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateProjectParticipantDto)
  participants?: CreateProjectParticipantDto[];
}
