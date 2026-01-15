import { Injectable } from '@nestjs/common';
import { Prisma } from 'src/generated/prisma/client';
import { CreateQuestionDto } from './dto/req/create-question.dto';
import { QuestionRepository } from './question.repository';
import { QuestionQueryDto, QuestionSort, QuestionStatus } from './dto/req/question-query.dto';

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

  async findAll(query: QuestionQueryDto) {
    const { status, sort, page, size } = query;

    const where: Prisma.QuestionWhereInput =
      status === QuestionStatus.UNANSWERED ? { answers: { none: {} } } : {};

    const orderBy: Prisma.QuestionOrderByWithRelationInput =
      sort === QuestionSort.LATEST ? { createdAt: 'desc' } : { upCount: 'desc' }; // 또는 upCount

    const skip = (page - 1) * size;
    const take = size;

    const { items, totalItems } = await this.questionRepo.findAllWithCount({
      where,
      orderBy,
      skip,
      take,
    });

    const totalPages = Math.ceil(totalItems / size);

    return {
      items: items.map((q) => ({
        id: Number(q.id),
        title: q.title,
        hashtags: q.hashtags ? q.hashtags.split(',') : [], // ✅ hashtags가 string이면 이렇게(예시)
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
        page,
        size,
        totalItems,
        totalPages,
        hasPrev: page > 1,
        hasNext: page < totalPages,
      },
    };
  }

  async findOne(idStr: string) {
    const id = BigInt(idStr);
    return this.questionRepo.findOne(id);
  }
}
