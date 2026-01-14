import { Expose } from 'class-transformer';

export class ProjectParticipantDto {
  @Expose()
  githubId: string;

  @Expose()
  avatarUrl: string | null;
}
