export class QuestionUserDto {
  id!: string; // BigInt → string
  nickname!: string;
  avatarUrl!: string | null;
  cohort!: number | null;
}
