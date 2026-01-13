import { Injectable } from '@nestjs/common';
import { Prisma, ContentState } from 'src/generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';

export type CreateQuestionInput = {
  memberId: bigint;
  title: string;
  contents: string;
  hashtags: string | null;
};

@Injectable()
export class QuestionRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(input: CreateQuestionInput) {
    return this.prisma.question.create({
      data: {
        member: { connect: { id: input.memberId } },
        title: input.title,
        contents: input.contents,
        hashtags: input.hashtags,
        state: ContentState.PUBLISHED,
      },
      include: {
        member: {
          select: {
            id: true,
            nickname: true,
            avatarUrl: true,
            cohort: true,
          },
        },
      },
    });
  }
}
