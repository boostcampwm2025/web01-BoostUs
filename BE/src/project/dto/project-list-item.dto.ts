import { Expose, Transform } from 'class-transformer';

export class ProjectListItemDto {
  @Expose()
  @Transform(({ value }) => Number(value))
  id: number;

  @Expose()
  thumbnailUrl: string | null;

  @Expose()
  title: string;

  @Expose()
  description: string | null;

  @Expose()
  cohort: number | null;

  @Expose()
  @Transform(({ obj }) => (obj.techStacks ?? []).map((x) => x.techStack.name))
  techStack: string[];

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  viewCount: number;
}
