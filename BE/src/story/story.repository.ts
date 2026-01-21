import { Injectable } from '@nestjs/common';
import { CursorPayload } from '../common/util/cursor.util';
import { ContentState, Prisma, Story } from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { StoryPeriod, StorySortBy } from './type/story-query.type';

@Injectable()
export class StoryRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 모든 공개된 캠퍼들의 이야기 목록 조회
   * @param sortBy StorySortBy
   * @param period StoryPeriod
   * @returns Story[]
   */
  async findAllPublishedStories({
    sortBy,
    period,
    take,
    cursor,
  }: {
    sortBy: StorySortBy;
    period: StoryPeriod;
    take: number;
    cursor?: CursorPayload;
  }): Promise<Story[]> {
    const cursorFilter = this.getCursorFilter(cursor);
    const periodFilter = this.getPeriodFilter(period);
    const orderBy = this.getOrderBy(sortBy);

    return this.prisma.story.findMany({
      take,
      where: {
        state: ContentState.PUBLISHED,
        ...periodFilter,
        ...cursorFilter,
      },
      include: {
        member: true,
      },
      orderBy,
    });
  }

  /**
   * ID로 Story 단건 조회
   * @param id bigint
   * @returns Story | null
   */
  async findStoryById(id: bigint): Promise<Story | null> {
    return this.prisma.story.findUnique({
      where: { id },
      include: {
        member: true,
      },
    });
  }

  /**
   * Story 생성 (upsert) 및 Feed lastFetchedAt 업데이트 (트랜잭션)
   * @param data Story 생성 데이터
   * @returns Story
   */
  async upsertStoryWithFeedUpdate(data: {
    guid: string;
    memberId: bigint;
    feedId: bigint;
    title: string;
    summary?: string;
    contents: string;
    thumbnailUrl?: string;
    originalUrl?: string;
    publishedAt: Date;
  }): Promise<Story> {
    return this.prisma.$transaction(async (tx) => {
      // Story upsert
      const story = await tx.story.upsert({
        where: { feedId_guid: { feedId: data.feedId, guid: data.guid } },
        update: {
          title: data.title,
          summary: data.summary,
          contents: data.contents,
          thumbnailUrl: data.thumbnailUrl,
          originalUrl: data.originalUrl,
          publishedAt: data.publishedAt,
        },
        create: {
          guid: data.guid,
          memberId: data.memberId,
          feedId: data.feedId,
          title: data.title,
          summary: data.summary,
          contents: data.contents,
          thumbnailUrl: data.thumbnailUrl,
          originalUrl: data.originalUrl,
          publishedAt: data.publishedAt,
          state: ContentState.PUBLISHED,
        },
      });

      // Feed의 lastFetchedAt 업데이트
      await tx.feed.update({
        where: { id: data.feedId },
        data: { lastFetchedAt: new Date() },
      });

      return story;
    });
  }

  /**
   * 기간 필터 생성
   */
  private getPeriodFilter(period: StoryPeriod) {
    if (period === StoryPeriod.ALL) return {};

    const now = new Date();
    const periodDays = {
      [StoryPeriod.DAILY]: 1,
      [StoryPeriod.WEEKLY]: 7,
      [StoryPeriod.MONTHLY]: 30,
    };

    const days = periodDays[period];
    const startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

    return {
      publishedAt: {
        gte: startDate,
      },
    };
  }

  /**
   * 커서 필터 생성
   * WHERE (field < cursor.v) OR (field = cursor.v AND id < cursor.id)
   */
  private getCursorFilter(cursor?: CursorPayload): Prisma.StoryWhereInput {
    if (!cursor) return {};
    const cursorId = BigInt(cursor.id);

    // 2-1. 최신순(publishedAt, id) 보다 작은 것들
    if (cursor.sort === 'LATEST') {
      const cursorDate = new Date(cursor.v);
      return {
        OR: [
          { publishedAt: { lt: cursorDate } },
          {
            AND: [{ publishedAt: { equals: cursorDate } }, { id: { lt: cursorId } }],
          },
        ],
      };
    }

    // 2-2. 조회순(viewCount, id) 보다 작은 것들
    if (cursor.sort === 'VIEWS') {
      return {
        OR: [
          { viewCount: { lt: cursor.v } },
          {
            AND: [{ viewCount: { equals: cursor.v } }, { id: { lt: cursorId } }],
          },
        ],
      };
    }

    // 2-3. 좋아요순(likeCount, id) 보다 작은 것들
    if (cursor.sort === 'LIKES') {
      return {
        OR: [
          { likeCount: { lt: cursor.v } },
          {
            AND: [{ likeCount: { equals: cursor.v } }, { id: { lt: cursorId } }],
          },
        ],
      };
    }

    return {};
  }

  /**
   * 정렬 조건 생성
   */
  private getOrderBy(sortBy: StorySortBy): Prisma.StoryOrderByWithRelationInput[] {
    switch (sortBy) {
      case StorySortBy.LATEST:
        return [{ publishedAt: 'desc' }, { id: 'desc' }];
      case StorySortBy.VIEWS:
        return [{ viewCount: 'desc' }, { id: 'desc' }];
      case StorySortBy.LIKES:
        return [{ likeCount: 'desc' }, { id: 'desc' }];
    }
  }
}
