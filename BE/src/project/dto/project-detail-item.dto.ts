import { Expose, Transform, Type } from 'class-transformer';
import { ProjectParticipantDto } from './project-participant.dto';

export class ProjectDetailItemDto {
  @Expose()
  @Transform(({ value }) => Number(value))
  id: number;

  @Expose()
  thumbnailUrl: string | null;

  @Expose()
  title: string | null;

  @Expose()
  description: string | null;

  @Expose()
  contents: string | null;

  @Expose()
  repoUrl: string;

  @Expose()
  demoUrl: string | null;

  @Expose()
  cohort: number | null;

  @Expose()
  startDate: Date | null;

  @Expose()
  endDate: Date | null;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  viewCount: number;

  @Expose()
  field: string;

  @Expose()
  @Type(() => ProjectParticipantDto)
  participants: ProjectParticipantDto[];
}
