import { Injectable } from '@nestjs/common';
import { Prisma, VoteType } from 'src/generated/prisma/client';
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

  update(id: bigint, data: Prisma.AnswerUpdateInput) {
    return this.prisma.answer.update({
      where: { id },
      data,
      include: {
        member: {
          select: { id: true, nickname: true, avatarUrl: true, cohort: true },
        },
      },
    });
  }

  // answer.repository.ts
  findOwnerIdByAnswerId(id: bigint) {
    return this.prisma.answer
      .findUnique({
        where: { id },
        select: { memberId: true },
      })
      .then((r) => r?.memberId ?? null);
  }
  async like(answerId: bigint, memberId: bigint) {
    const existing = await this.prisma.answerVote.findUnique({
      where: {
        memberId_answerId: {
          memberId,
          answerId,
        },
      },
    });

    if (!existing) {
      await this.prisma.answerVote.create({
        data: {
          memberId,
          answerId,
          voteType: VoteType.UP,
        },
      });

      await this.prisma.answer.update({
        where: { id: answerId },
        data: { upCount: { increment: 1 } },
      });
    }
  }

  async dislike(answerId: bigint, memberId: bigint) {
    const existing = await this.prisma.answerVote.findUnique({
      where: {
        memberId_answerId: {
          memberId,
          answerId,
        },
      },
    });

    if (!existing) {
      await this.prisma.answerVote.create({
        data: {
          memberId,
          answerId,
          voteType: VoteType.DOWN,
        },
      });

      await this.prisma.answer.update({
        where: { id: answerId },
        data: { downCount: { increment: 1 } },
      });
    }
  }
}
