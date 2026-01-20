import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform, Type } from 'class-transformer';
import { ProjectField } from '../type/project-field.type';
import { ProjectParticipantDto } from './project-participant.dto';

export class ProjectDetailItemDto {
  @ApiProperty({
    description: '프로젝트 ID',
    example: 1,
  })
  @Expose()
  @Transform(({ value }) => Number(value))
  id: number;

  @ApiProperty({
    description: '썸네일 이미지 URL',
    example: 'https://example.com/thumbnail.jpg',
    nullable: true,
  })
  @Expose()
  thumbnailUrl: string | null;

  @ApiProperty({
    description: '프로젝트 제목',
    example: '부스트 캠프 최종 프로젝트',
    nullable: true,
  })
  @Expose()
  title: string | null;

  @ApiProperty({
    description: '프로젝트 설명',
    example: '팀 협업 프로젝트 관리 서비스',
    nullable: true,
  })
  @Expose()
  description: string | null;

  @ApiProperty({
    description: '프로젝트 상세 내용',
    example: '# 프로젝트 소개\n\n팀원들과 함께...',
    nullable: true,
  })
  @Expose()
  contents: string | null;

  @ApiProperty({
    description: 'GitHub 저장소 URL',
    example: 'https://github.com/username/repository',
  })
  @Expose()
  repoUrl: string;

  @ApiProperty({
    description: '데모/배포 URL',
    example: 'https://project-demo.com',
    nullable: true,
  })
  @Expose()
  demoUrl: string | null;

  @ApiProperty({
    description: '부스트캠프 기수',
    example: 10,
    nullable: true,
  })
  @Expose()
  cohort: number | null;

  @ApiProperty({
    description: '프로젝트 시작일',
    example: '2024-01-01T00:00:00Z',
    nullable: true,
  })
  @Expose()
  startDate: Date | null;

  @ApiProperty({
    description: '프로젝트 종료일',
    example: '2024-02-28T00:00:00Z',
    nullable: true,
  })
  @Expose()
  endDate: Date | null;

  @ApiProperty({
    description: '생성일시',
    example: '2024-01-19T12:00:00Z',
  })
  @Expose()
  createdAt: Date;

  @ApiProperty({
    description: '수정일시',
    example: '2024-01-19T12:00:00Z',
  })
  @Expose()
  updatedAt: Date;

  @ApiProperty({
    description: '조회수',
    example: 150,
  })
  @Expose()
  viewCount: number;

  @ApiProperty({
    description: '프로젝트 분야',
    example: 'WEB',
    enum: ProjectField,
    nullable: true,
  })
  @Expose()
  field: ProjectField | null;

  @ApiProperty({
    description: '프로젝트 참여자 목록',
    type: [ProjectParticipantDto],
  })
  @Expose()
  @Type(() => ProjectParticipantDto)
  participants: ProjectParticipantDto[];
}
