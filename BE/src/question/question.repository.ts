import { Injectable } from '@nestjs/common';
import { Prisma, ContentState } from 'src/generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';

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
        answers: true,
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
}
