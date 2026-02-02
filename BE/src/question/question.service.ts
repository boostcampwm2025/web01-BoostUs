import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from 'src/generated/prisma/client';
import { decodeCursor, encodeCursor } from '../common/util/cursor.util';
import { CreateQuestionDto } from './dto/req/create-question.dto';
import { QuestionQueryDto, QuestionSort, QuestionStatus } from './dto/req/question-query.dto';
import { QuestionRepository } from './question.repository';
import { QuestionResponseDto } from './dto/res/detail/question-response.dto';
import { UpdateQuestionDto } from './dto/req/update-question.dto';
import { ViewService } from 'src/view/view.service';
import { QuestionNotFoundException } from './exception/question.exception';
import { QuestionCursorResponseDto } from './dto/res/all/question-list.dto';
import { Reaction } from 'src/enum/reaction';
import { QuestionDetailItemDto } from './dto/res/detail/question-detail-item.dto';

const toHashtagsStringOrNull = (hashtags?: string[]): string | null =>
  hashtags && hashtags.length ? hashtags.join(',') : null;

@Injectable()
export class QuestionService {
  constructor(
    private readonly questionRepo: QuestionRepository,
    private readonly viewService: ViewService,
  ) {}
  //응답 dto 없음
  async create(memberIdStr: string, dto: CreateQuestionDto) {
    const memberId = BigInt(memberIdStr);

    return this.questionRepo.create({
      memberId,
      title: dto.title,
      contents: dto.contents,
      hashtags: toHashtagsStringOrNull(dto.hashtags),
    });
  }

  async findAllCursor(
    query: QuestionQueryDto,
    memberIdStr?: string,
  ): Promise<QuestionCursorResponseDto> {
    const { status, sort, size, cursor } = query;
    const memberId = memberIdStr ? BigInt(memberIdStr) : null;
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
    let reactionMap = new Map<string, Reaction>();
    if (memberId) {
      const questionIds = sliced.map((q) => q.id);
      reactionMap = await this.questionRepo.getQuestionReactionsBulk(questionIds, memberId);
    }
    return {
      items: sliced.map((q) => ({
        id: q.id.toString(),
        title: q.title,
        hashtags: q.hashtags ? q.hashtags.split(',') : [],
        upCount: q.upCount,
        downCount: q.downCount,
        viewCount: q.viewCount,
        answerCount: q._count.answers,
        isResolved: q.isResolved,
        createdAt: q.createdAt.toISOString(),
        updatedAt: q.updatedAt.toISOString(),
        reaction: memberId ? (reactionMap.get(q.id.toString()) ?? Reaction.NONE) : Reaction.NONE,
        member: {
          id: BigInt(q.member.id),
          nickname: q.member.nickname,
          avatarUrl: q.member.avatarUrl,
          cohort: q.member.cohort,
        },
      })),
      meta: {
        size: sizeSafe,
        hasNext,
        nextCursor,
        prevCursor: cursor || null,
      },
    };
  }

  async findOne(idStr: string, memberIdStr?: string): Promise<QuestionDetailItemDto> {
    const id = BigInt(idStr);
    const q = await this.questionRepo.findOne(id);
    if (!q) throw new QuestionNotFoundException(id);
    const memberId = memberIdStr ? BigInt(memberIdStr) : null;

    let questionReaction: Reaction = Reaction.NONE;
    if (memberId) {
      questionReaction = await this.questionRepo.getQuestionReaction(q.id, memberId);
    }

    let answerReactionMap = new Map<string, Reaction>();
    if (memberId) {
      const answerIds = q.answers.map((a) => a.id);
      answerReactionMap = await this.questionRepo.getQuestionReactionsBulk(answerIds, memberId);
    }
    return {
      question: {
        id: q.id.toString(),
        title: q.title,
        contents: q.contents,
        hashtags: q.hashtags ? q.hashtags.split(',') : [],
        upCount: q.upCount,
        downCount: q.downCount,
        viewCount: q.viewCount,
        isResolved: q.isResolved,
        state: q.state,
        answerCount: q._count.answers,
        createdAt: q.createdAt.toISOString(),
        updatedAt: q.updatedAt.toISOString(),
        member: q.member,
        reaction: questionReaction,
      },
      answers: q.answers.map((a) => ({
        id: a.id.toString(),
        questionId: a.questionId.toString(),
        contents: a.contents,
        isAccepted: a.isAccepted,
        upCount: a.upCount,
        downCount: a.downCount,
        state: a.state,
        createdAt: a.createdAt.toISOString(),
        updatedAt: a.updatedAt.toISOString(),
        member: a.member,
        reaction: answerReactionMap.get(a.id.toString()),
      })),
    };
  }

  async incrementStoryView(id: bigint, viewerKey: string): Promise<void> {
    const questionId = BigInt(id);

    const questionExists = await this.questionRepo.checkQuestionExists(questionId);
    if (!questionExists) {
      throw new QuestionNotFoundException(questionId);
    }

    const shouldIncrement = await this.viewService.shouldIncrementView(
      'question',
      questionId,
      viewerKey,
    );
    if (shouldIncrement) {
      await this.questionRepo.incrementViewCount(id);
    }
  }

  async update(
    idstr: string,
    memberIdStr: string | undefined,
    dto: UpdateQuestionDto,
  ): Promise<QuestionResponseDto> {
    if (!memberIdStr) throw new BadRequestException('로그인을 하셨어야죠');

    const id = BigInt(idstr);
    const memberId = BigInt(memberIdStr);

    const ownerId = await this.questionRepo.findOwnerIdByQuestionId(id);
    if (!ownerId) throw new NotFoundException('질문의 주인이 없소');

    if (ownerId !== memberId) {
      throw new ForbiddenException('수정권한이 없소');
    }

    const hashtagsValue =
      dto.hashtags === undefined ? undefined : toHashtagsStringOrNull(dto.hashtags);

    const updated = await this.questionRepo.update(id, {
      contents: dto.contents,
      title: dto.title,
      hashtags: hashtagsValue,
    });

    return {
      id: updated.id.toString(),
      title: updated.title,
      contents: updated.contents,
      hashtags: updated.hashtags ? updated.hashtags.split(',') : [],
      upCount: updated.upCount,
      downCount: updated.downCount,
      viewCount: updated.viewCount,
      isResolved: updated.isResolved,
      state: updated.state,
      answerCount: updated._count.answers,
      createdAt: updated.createdAt.toISOString(),
      updatedAt: updated.updatedAt.toISOString(),
      reaction: Reaction.NONE,
      member: {
        id: updated.member.id,
        nickname: updated.member.nickname,
        avatarUrl: updated.member.avatarUrl,
        cohort: updated.member.cohort,
      },
    };
  }

  async delete(idstr: string, memberIdStr: string | undefined) {
    if (!memberIdStr) throw new BadRequestException('로그인을 하셨어야죠');

    const id = BigInt(idstr);
    const memberId = BigInt(memberIdStr);

    // ✅ 작성자 확인용으로 최소 조회
    const ownerId = await this.questionRepo.findOwnerIdByQuestionId(id);
    if (!ownerId) throw new NotFoundException('질문의 주인이 없소');

    if (ownerId !== memberId) {
      throw new ForbiddenException('삭제권한이 없소');
    }

    await this.questionRepo.update(id, { state: 'DELETED' });
    return { id: idstr };
  }
  async getQuestionsCount() {
    return this.questionRepo.countByAnswerAndResolution();
  }

  async accept(questionIdStr: string, answerIdStr: string, memberIdStr: string | undefined) {
    if (!memberIdStr) throw new BadRequestException('로그인을 하셨어야죠');

    const questionId = BigInt(questionIdStr);
    const answerId = BigInt(answerIdStr);
    const memberId = BigInt(memberIdStr);

    const ownerId = await this.questionRepo.findOwnerIdByQuestionId(questionId);
    if (!ownerId) throw new NotFoundException('질문을 찾을 수 없음');

    if (ownerId !== memberId) {
      throw new ForbiddenException('채택권한이 없소');
    }

    const result = await this.questionRepo.acceptAnswer(questionId, answerId);

    if (result === 'ANSWER_NOT_FOUND') throw new NotFoundException('답변을 찾을 수 없음');
    if (result === 'ANSWER_NOT_IN_QUESTION') {
      throw new BadRequestException('해당 질문에 달린 답변이 아닙니다');
    }

    return this.findOne(questionIdStr, memberId.toString());
  }

  async like(questionIdStr: string, memberIdStr: string | undefined) {
    if (!memberIdStr) throw new BadRequestException('로그인을 하셨어야죠');

    const questionId = BigInt(questionIdStr);
    const memberId = BigInt(memberIdStr);

    await this.questionRepo.like(questionId, memberId);
    return questionId;
  }

  async dislike(questionIdStr: string, memberIdStr: string | undefined) {
    if (!memberIdStr) throw new BadRequestException('로그인을 하셨어야죠');

    const questionId = BigInt(questionIdStr);
    const memberId = BigInt(memberIdStr);

    await this.questionRepo.dislike(questionId, memberId);
    return questionId;
  }
}
