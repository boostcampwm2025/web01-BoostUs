import { Injectable } from '@nestjs/common';
import { Prisma, ContentState } from 'src/generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { VoteType } from 'src/generated/prisma/client';

export type CreateQuestionInput = {
  memberId: bigint;
  title: string;
  contents: string;
  hashtags: string | null;
};

export type SearchParams = {
  where?: Prisma.QuestionWhereInput;
  orderBy?: Prisma.QuestionOrderByWithRelationInput;
  skip?: number;
  take?: number;
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
          select: { id: true, nickname: true, avatarUrl: true, cohort: true },
        },
      },
    });
  }

  // QuestionRepository.ts
  findAll(args: Prisma.QuestionFindManyArgs) {
    return this.prisma.question.findMany({
      ...args,
      include: {
        member: true,
        _count: { select: { answers: true } },
      },
    });
  }

  async findAllWithCount(params: SearchParams) {
    const { where, orderBy, skip, take } = params;

    const [items, totalItems] = await Promise.all([
      this.prisma.question.findMany({
        where,
        orderBy,
        skip,
        take,
        include: {
          member: {
            select: { id: true, nickname: true, avatarUrl: true, cohort: true },
          },
          _count: { select: { answers: true } },
        },
      }),
      this.prisma.question.count({ where }),
    ]);

    return { items, totalItems };
  }

  async findOne(id: bigint) {
    return this.prisma.question.findUnique({
      where: { id },
      include: {
        member: { select: { id: true, nickname: true, avatarUrl: true, cohort: true } },
        answers: {
          where: { state: ContentState.PUBLISHED },
          orderBy: { createdAt: 'desc' },
          include: {
            member: {
              select: { id: true, nickname: true, avatarUrl: true, cohort: true },
            },
          },
        },
        _count: { select: { answers: true } },
      },
    });
  }

  async countByAnswerAndResolution() {
    const total = await this.prisma.question.count(); // 전체 질문 수

    const noAnswer = await this.prisma.question.count({
      where: {
        answers: { none: {} },
      },
    });

    const unsolved = await this.prisma.question.count({
      where: {
        isResolved: false,
      },
    });

    const solved = await this.prisma.question.count({
      where: {
        isResolved: true,
      },
    });

    return {
      total: total.toString(),
      noAnswer: noAnswer.toString(),
      unsolved: unsolved.toString(),
      solved: solved.toString(),
    };
  }

  update(id: bigint, data: Prisma.QuestionUpdateInput) {
    return this.prisma.question.update({
      where: { id },
      data,
      include: {
        member: {
          select: { id: true, nickname: true, avatarUrl: true, cohort: true },
        },
        _count: { select: { answers: true } },
      },
    });
  }

  async acceptAnswer(questionId: bigint, answerId: bigint) {
    return this.prisma.$transaction(async (tx) => {
      // 1답변 존재 + questionId 매칭 확인
      const a = await tx.answer.findUnique({
        where: { id: answerId },
        select: { id: true, questionId: true },
      });

      if (!a) return 'ANSWER_NOT_FOUND' as const;
      if (a.questionId !== questionId) return 'ANSWER_NOT_IN_QUESTION' as const;

      // 2답변 채택 처리
      await tx.answer.update({
        where: { id: answerId },
        data: { isAccepted: true },
      });

      // 3질문 해결 처리
      await tx.question.update({
        where: { id: questionId },
        data: { isResolved: true },
      });

      return 'OK' as const;
    });
  }

  async findOwnerIdByQuestionId(id: bigint) {
    return this.prisma.question
      .findUnique({
        where: { id },
        select: { memberId: true },
      })
      .then((r) => r?.memberId ?? null);
  }

  async like(questionId: bigint, memberId: bigint) {
    const existing = await this.prisma.questionVote.findUnique({
      where: {
        memberId_questionId: {
          memberId,
          questionId,
        },
      },
    });

    if (!existing) {
      await this.prisma.questionVote.create({
        data: {
          memberId,
          questionId,
          voteType: VoteType.UP,
        },
      });

      await this.prisma.question.update({
        where: { id: questionId },
        data: { upCount: { increment: 1 } },
      });
    }
  }
  async dislike(questionId: bigint, memberId: bigint) {
    const existing = await this.prisma.questionVote.findUnique({
      where: {
        memberId_questionId: {
          memberId,
          questionId,
        },
      },
    });

    if (!existing) {
      await this.prisma.questionVote.create({
        data: {
          memberId,
          questionId,
          voteType: VoteType.DOWN,
        },
      });

      await this.prisma.question.update({
        where: { id: questionId },
        data: { downCount: { increment: 1 } },
      });
    }
  }
}
