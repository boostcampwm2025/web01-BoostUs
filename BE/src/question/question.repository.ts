import { Injectable } from '@nestjs/common';
import { Prisma, ContentState } from 'src/generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { VoteType } from 'src/generated/prisma/client';
import { Reaction } from 'src/enum/reaction';

const voteTypeToReaction = (voteType?: VoteType | null): Reaction => {
  if (!voteType) return Reaction.NONE;
  return voteType === VoteType.UP ? Reaction.LIKE : Reaction.DISLIKE;
};

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
      where: {
        ...args.where,
        state: ContentState.PUBLISHED,
      },
      include: {
        member: true,
        _count: { select: { answers: { where: { state: ContentState.PUBLISHED } } } },
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
          _count: { select: { answers: { where: { state: ContentState.PUBLISHED } } } },
        },
      }),
      this.prisma.question.count({ where }),
    ]);

    return { items, totalItems };
  }

  async checkQuestionExists(id: bigint): Promise<boolean> {
    const story = await this.prisma.question.findUnique({
      where: { id },
      select: { id: true },
    });
    return story !== null;
  }

  async incrementViewCount(id: bigint): Promise<void> {
    await this.prisma.question.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
    });
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
        _count: { select: { answers: { where: { state: ContentState.PUBLISHED } } } },
      },
    });
  }

  async countByAnswerAndResolution() {
    const total = await this.prisma.question.count({ where: { state: ContentState.PUBLISHED } }); // 전체 질문 수

    const noAnswer = await this.prisma.question.count({
      where: {
        answers: { none: {} },
        state: ContentState.PUBLISHED,
      },
    });

    const unsolved = await this.prisma.question.count({
      where: {
        isResolved: false,
        state: ContentState.PUBLISHED,
      },
    });

    const solved = await this.prisma.question.count({
      where: {
        isResolved: true,
        state: ContentState.PUBLISHED,
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
    //질문 투표 조회
    const existing = await this.prisma.questionVote.findUnique({
      where: {
        memberId_questionId: {
          memberId,
          questionId,
        },
      },
    });
    //투표 존재 하지 않으면 생성
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
    // UP 투표 존재시 삭제
    else if (existing.voteType === VoteType.UP) {
      await this.prisma.questionVote.delete({
        where: {
          memberId_questionId: {
            memberId,
            questionId,
          },
        },
      });

      await this.prisma.question.update({
        where: { id: questionId },
        data: { upCount: { decrement: 1 } },
      });
    }
    //DOWN 투표 존재시 UP 투표로 변경
    else if (existing.voteType === VoteType.DOWN) {
      await this.prisma.questionVote.update({
        where: {
          memberId_questionId: {
            memberId,
            questionId,
          },
        },
        data: {
          voteType: VoteType.UP,
        },
      });

      await this.prisma.question.update({
        where: { id: questionId },
        data: { upCount: { increment: 1 }, downCount: { decrement: 1 } },
      });
    }
  }

  async dislike(questionId: bigint, memberId: bigint) {
    //질문 투표 조회
    const existing = await this.prisma.questionVote.findUnique({
      where: {
        memberId_questionId: {
          memberId,
          questionId,
        },
      },
    });
    //투표 존재 하지 않으면 생성
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
    // DOWN 투표 존재시 삭제
    else if (existing.voteType === VoteType.DOWN) {
      await this.prisma.questionVote.delete({
        where: {
          memberId_questionId: {
            memberId,
            questionId,
          },
        },
      });

      await this.prisma.question.update({
        where: { id: questionId },
        data: { downCount: { decrement: 1 } },
      });
    }
    //UP 투표 존재시 DOWN 투표로 변경
    else if (existing.voteType === VoteType.UP) {
      await this.prisma.questionVote.update({
        where: {
          memberId_questionId: {
            memberId,
            questionId,
          },
        },
        data: {
          voteType: VoteType.DOWN,
        },
      });

      await this.prisma.question.update({
        where: { id: questionId },
        data: { downCount: { increment: 1 }, upCount: { decrement: 1 } },
      });
    }
  }

  async getQuestionReaction(questionId: bigint, memberId: bigint): Promise<Reaction> {
    const vote = await this.prisma.questionVote.findUnique({
      where: { memberId_questionId: { memberId, questionId } },
      select: { voteType: true },
    });

    return voteTypeToReaction(vote?.voteType);
  }

  async getAnswerReaction(answerId: bigint, memberId: bigint): Promise<Reaction> {
    const vote = await this.prisma.answerVote.findUnique({
      where: { memberId_answerId: { memberId, answerId } },
      select: { voteType: true },
    });

    return voteTypeToReaction(vote?.voteType);
  }
  async getQuestionReactionsBulk(
    questionIds: bigint[],
    memberId: bigint,
  ): Promise<Map<string, Reaction>> {
    if (questionIds.length === 0) return new Map();

    const votes = await this.prisma.questionVote.findMany({
      where: {
        memberId,
        questionId: { in: questionIds },
      },
      select: {
        questionId: true,
        voteType: true,
      },
    });

    // 기본값 NONE 세팅
    const map = new Map<string, Reaction>();
    for (const qid of questionIds) map.set(qid.toString(), Reaction.NONE);

    // 실제 vote 덮어쓰기
    for (const v of votes) {
      map.set(v.questionId.toString(), voteTypeToReaction(v.voteType));
    }

    return map;
  }

  async getAnswerReactionsBulk(
    answerIds: bigint[],
    memberId: bigint,
  ): Promise<Map<string, Reaction>> {
    if (answerIds.length === 0) return new Map();

    const votes = await this.prisma.answerVote.findMany({
      where: {
        memberId,
        answerId: { in: answerIds },
      },
      select: {
        answerId: true,
        voteType: true,
      },
    });

    const map = new Map<string, Reaction>();
    for (const aid of answerIds) map.set(aid.toString(), Reaction.NONE);

    for (const v of votes) {
      map.set(v.answerId.toString(), voteTypeToReaction(v.voteType));
    }

    return map;
  }
}
