import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from 'src/generated/prisma/client';
import { CreateQuestionDto } from './dto/req/create-question.dto';
import { QuestionRepository } from './question.repository';
import { QuestionQueryDto, QuestionSort, QuestionStatus } from './dto/req/question-query.dto';
import { encodeCursor, decodeCursor } from './util/cursor.util';

@Injectable()
export class QuestionService {
  constructor(private readonly questionRepo: QuestionRepository) {}

  async create(memberIdStr: string, dto: CreateQuestionDto) {
    const memberId = BigInt(memberIdStr);

    return this.questionRepo.create({
      memberId,
      title: dto.title,
      contents: dto.contents,
      hashtags: dto.hashtags ?? null,
    });
  }

  async findAllCursor(query: QuestionQueryDto) {
    const { status, sort, size, cursor } = query;

    let baseWhere: Prisma.QuestionWhereInput = {};

    switch (status) {
      case QuestionStatus.UNANSWERED:
        baseWhere = { answers: { none: {} } };
        break;

      case QuestionStatus.UNSOLVED:
        baseWhere = { isResolved: false };
        break;

      case QuestionStatus.SOLVED:
        baseWhere = { isResolved: true };
        break;

      case QuestionStatus.ALL:
      default:
        baseWhere = {};
    }

    // cursor 디코딩
    const decoded = cursor ? decodeCursor(cursor) : null;

    // 정렬 + 커서 조건
    let where: Prisma.QuestionWhereInput = baseWhere;
    let orderBy: Prisma.QuestionOrderByWithRelationInput[] = [];

    if (sort === QuestionSort.LATEST) {
      orderBy = [{ createdAt: 'desc' }, { id: 'desc' }];

      if (decoded) {
        if (decoded.sort !== 'LATEST') throw new BadRequestException('Cursor sort mismatch');

        // (createdAt, id) 보다 "작은" 것들
        where = {
          AND: [
            baseWhere,
            {
              OR: [
                { createdAt: { lt: new Date(decoded.v) } },
                { createdAt: new Date(decoded.v), id: { lt: BigInt(decoded.id) } },
              ],
            },
          ],
        };
      }
    }

    if (sort === QuestionSort.LIKES) {
      orderBy = [{ upCount: 'desc' }, { id: 'desc' }];

      if (decoded) {
        if (decoded.sort !== 'LIKES') throw new BadRequestException('Cursor sort mismatch');

        where = {
          AND: [
            baseWhere,
            {
              OR: [
                { upCount: { lt: decoded.v } },
                { upCount: decoded.v, id: { lt: BigInt(decoded.id) } },
              ],
            },
          ],
        };
      }
    }

    if (sort === QuestionSort.VIEWS) {
      orderBy = [{ viewCount: 'desc' }, { id: 'desc' }];

      if (decoded) {
        if (decoded.sort !== 'VIEWS') throw new BadRequestException('Cursor sort mismatch');

        where = {
          AND: [
            baseWhere,
            {
              OR: [
                { viewCount: { lt: decoded.v } },
                { viewCount: decoded.v, id: { lt: BigInt(decoded.id) } },
              ],
            },
          ],
        };
      }
    }

    // ✅ take+1로 다음 페이지 존재 여부 판단
    const sizeSafe = size ?? 10;
    const take = sizeSafe + 1;

    const items = await this.questionRepo.findAll({
      where,
      orderBy,
      take,
    });

    const hasNext = items.length > sizeSafe;
    const sliced = hasNext ? items.slice(0, sizeSafe) : items;

    // ✅ nextCursor 생성 (마지막 아이템 기준)
    let nextCursor: string | null = null;
    if (hasNext) {
      const last = sliced[sliced.length - 1];

      if (sort === QuestionSort.LATEST) {
        nextCursor = encodeCursor({
          sort: 'LATEST',
          v: last.createdAt.toISOString(),
          id: String(last.id),
        });
      } else if (sort === QuestionSort.LIKES) {
        nextCursor = encodeCursor({
          sort: 'LIKES',
          v: last.upCount,
          id: String(last.id),
        });
      } else {
        nextCursor = encodeCursor({
          sort: 'VIEWS',
          v: last.viewCount,
          id: String(last.id),
        });
      }
    }

    return {
      items: sliced.map((q) => ({
        id: Number(q.id),
        title: q.title,
        hashtags: q.hashtags ? q.hashtags.split(',') : [],
        upCount: q.upCount,
        downCount: q.downCount,
        viewCount: q.viewCount,
        answerCount: q._count.answers,
        isResolved: q.isResolved,
        createdAt: q.createdAt.toISOString(),
        updatedAt: q.updatedAt.toISOString(),
        member: {
          id: Number(q.member.id),
          nickname: q.member.nickname,
          avatarUrl: q.member.avatarUrl,
          cohort: q.member.cohort,
        },
      })),
      meta: {
        size,
        hasNext,
        nextCursor,
        prevCursor: cursor || null,
      },
    };
  }

  async findOne(idStr: string) {
    const id = BigInt(idStr);
    const q = await this.questionRepo.findOne(id);

    if (!q) throw new Error('Question not found');

    return {
      question: {
        id: Number(q.id),
        title: q.title,
        content: q.contents,
        hashtags: q.hashtags ? q.hashtags.split(',') : [],
        upCount: q.upCount,
        viewCount: q.viewCount,
        answerCount: q._count.answers,
        isResolved: q.isResolved,
        createdAt: q.createdAt.toISOString(),
        updatedAt: q.updatedAt.toISOString(),
        member: {
          id: Number(q.member.id),
          nickname: q.member.nickname,
          avatarUrl: q.member.avatarUrl,
          cohort: q.member.cohort,
        },
        answers: q.answers.map((a) => ({
          id: Number(a.id),
          contents: a.contents,
          upCount: a.upCount,
          downCount: a.downCount,
          isAccepted: a.isAccepted,
          createdAt: a.createdAt.toISOString(),
          updatedAt: a.updatedAt.toISOString(),
          member: {
            id: Number(a.member.id),
            nickname: a.member.nickname,
            avatarUrl: a.member.avatarUrl,
            cohort: a.member.cohort,
          },
        })),
      },
    };
  }

  getQuestionsCount() {
    return this.questionRepo.countByAnswerAndResolution();
  }
}
