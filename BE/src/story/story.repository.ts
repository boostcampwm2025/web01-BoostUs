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
    const cursorFilter = this.getCursorFilter(sortBy, cursor);
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
   * 스토리 조회수만 증가
   * @param id bigint
   */
  async incrementViewCount(id: bigint): Promise<void> {
    await this.prisma.story.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
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
  private getCursorFilter(sortBy: StorySortBy, cursor?: CursorPayload): Prisma.StoryWhereInput {
    if (!cursor) return {};
    const cursorId = BigInt(cursor.id);

    // 2-1. 최신순(publishedAt, id) 보다 작은 것들
    if (sortBy === StorySortBy.LATEST) {
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

    // 2-2. 조회순(viewCount, publishedAt, id) 보다 작은 것들
    if (sortBy === StorySortBy.VIEWS && cursor.sort === 'VIEWS') {
      const cursorViewCount = Number(cursor.v);
      const cursorPublishedAt = cursor.publishedAt ? new Date(cursor.publishedAt) : undefined;

      if (!cursorPublishedAt) {
        return {};
      }

      return {
        OR: [
          { viewCount: { lt: cursorViewCount } },
          {
            AND: [
              { viewCount: { equals: cursorViewCount } },
              { publishedAt: { lt: cursorPublishedAt } },
            ],
          },
          {
            AND: [
              { viewCount: { equals: cursorViewCount } },
              { publishedAt: { equals: cursorPublishedAt } },
              { id: { lt: cursorId } },
            ],
          },
        ],
      };
    }

    // 2-3. 좋아요순(likeCount, publishedAt, id) 보다 작은 것들
    if (sortBy === StorySortBy.LIKES && cursor.sort === 'LIKES') {
      const cursorLikeCount = Number(cursor.v);
      const cursorPublishedAt = cursor.publishedAt ? new Date(cursor.publishedAt) : undefined;

      if (!cursorPublishedAt) {
        return {};
      }

      return {
        OR: [
          { likeCount: { lt: cursorLikeCount } },
          {
            AND: [
              { likeCount: { equals: cursorLikeCount } },
              { publishedAt: { lt: cursorPublishedAt } },
            ],
          },
          {
            AND: [
              { likeCount: { equals: cursorLikeCount } },
              { publishedAt: { equals: cursorPublishedAt } },
              { id: { lt: cursorId } },
            ],
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
        return [{ viewCount: 'desc' }, { publishedAt: 'desc' }, { id: 'desc' }];

      case StorySortBy.LIKES:
        return [{ likeCount: 'desc' }, { publishedAt: 'desc' }, { id: 'desc' }];
    }
  }

  /**
   * Story 존재 여부 확인
   * @param storyId bigint
   * @returns boolean
   */
  async checkStoryExists(storyId: bigint): Promise<boolean> {
    const story = await this.prisma.story.findUnique({
      where: { id: storyId },
      select: { id: true },
    });
    return story !== null;
  }

  /**
   * StoryLike 존재 여부 확인
   * @param storyId bigint
   * @param memberId bigint
   * @returns boolean
   */
  async checkStoryLikeExists(storyId: bigint, memberId: bigint): Promise<boolean> {
    const storyLike = await this.prisma.storyLike.findUnique({
      where: {
        memberId_storyId: {
          memberId,
          storyId,
        },
      },
    });
    return storyLike !== null;
  }

  /**
   * 캠퍼들의 이야기 좋아요 등록
   * @param storyId bigint
   * @param memberId bigint
   * @returns void
   */
  async likeStory(storyId: bigint, memberId: bigint): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      // StoryLike 중복 확인
      const existing = await tx.storyLike.findUnique({
        where: {
          memberId_storyId: {
            memberId,
            storyId,
          },
        },
      });

      if (existing) {
        // 이미 좋아요한 경우는 애플리케이션 레벨에서 처리
        // DB 유니크 제약조건으로도 방지되지만 명확한 에러를 위해 여기서 체크
        return;
      }

      // StoryLike 생성 및 Story.likeCount 증가
      await tx.storyLike.create({
        data: {
          memberId,
          storyId,
        },
      });

      await tx.story.update({
        where: { id: storyId },
        data: { likeCount: { increment: 1 } },
      });
    });
  }

  /**
   * 캠퍼들의 이야기 좋아요 취소
   * @param storyId bigint
   * @param memberId bigint
   * @returns void
   */
  async unlikeStory(storyId: bigint, memberId: bigint): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      // StoryLike 존재 확인
      const existing = await tx.storyLike.findUnique({
        where: {
          memberId_storyId: {
            memberId,
            storyId,
          },
        },
      });

      if (!existing) {
        // 좋아요하지 않은 경우는 애플리케이션 레벨에서 처리
        return;
      }

      // StoryLike 삭제 및 Story.likeCount 감소
      await tx.storyLike.delete({
        where: {
          memberId_storyId: {
            memberId,
            storyId,
          },
        },
      });

      await tx.story.update({
        where: { id: storyId },
        data: { likeCount: { decrement: 1 } },
      });
    });
  }
}
