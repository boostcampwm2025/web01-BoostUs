import { ContentState } from 'src/generated/prisma/enums';
import { QuestionUserDto } from './question-user.dto';

export class QuestionResponseDto {
  id!: string; // BigInt → string

  title!: string;
  contents!: string;
  hashtags!: string[];

  upCount!: number; // Prisma upCount
  downCount!: number; // Prisma downCount
  viewCount!: number;

  isResolved!: boolean;
  contentState!: ContentState;

  createdAt!: string; // ISO string
  updatedAt!: string; // ISO string

  user!: QuestionUserDto;
}
