import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';

export class ProjectListItemDto {
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
  })
  @Expose()
  title: string;

  @ApiProperty({
    description: '프로젝트 설명',
    example: '팀 협업 프로젝트 관리 서비스',
    nullable: true,
  })
  @Expose()
  description: string | null;

  @ApiProperty({
    description: '부스트캠프 기수',
    example: 10,
    nullable: true,
  })
  @Expose()
  cohort: number | null;

  @ApiProperty({
    description: '기술 스택 목록',
    example: ['React', 'NestJS', 'TypeScript'],
    type: [String],
  })
  @Expose()
  @Transform(({ obj }: { obj: { techStacks?: Array<{ techStack: { name: string } }> } }) => {
    const techStacks = obj.techStacks ?? [];
    return techStacks.map((x) => x.techStack.name);
  })
  techStack: string[];

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
    example: 'Web',
  })
  @Expose()
  field: string;
}
