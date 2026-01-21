import { Injectable } from '@nestjs/common';
import { Prisma } from 'src/generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';

export type CreateAnswerInput = {
  memberId: bigint;
  questionId: bigint;
  contents: string;
};

@Injectable()
export class AnswerRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(input: CreateAnswerInput) {
    return this.prisma.answer.create({
      data: {
        member: { connect: { id: input.memberId } },
        question: { connect: { id: input.questionId } },
        contents: input.contents,
      },
      include: {
        member: {
          select: { id: true, nickname: true, avatarUrl: true, cohort: true },
        },
      },
    });
  }
}
