import { Injectable } from '@nestjs/common';
import { ContentState, Story } from '../generated/prisma/client';
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
  async findAllPublishedStories(sortBy: StorySortBy, period: StoryPeriod): Promise<Story[]> {
    const periodFilter = this.getPeriodFilter(period);
    const orderBy = this.getOrderBy(sortBy);

    return this.prisma.story.findMany({
      where: {
        state: ContentState.PUBLISHED,
        ...periodFilter,
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
   * GUID로 Story 조회
   * @param guid string
   * @returns Story | null
   */
  async findStoryByGuid(guid: string): Promise<Story | null> {
    return this.prisma.story.findUnique({
      where: { guid },
    });
  }

  /**
   * Story 생성 (upsert)
   * @param data Story 생성 데이터
   * @returns Story
   */
  async upsertStory(data: {
    guid: string;
    memberId: bigint;
    feedsId: bigint;
    title: string;
    summary?: string;
    contents: string;
    thumbnailUrl?: string;
    originalUrl?: string;
    publishedAt: Date;
  }): Promise<Story> {
    return this.prisma.story.upsert({
      where: { guid: data.guid },
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
        feedsId: data.feedsId,
        title: data.title,
        summary: data.summary,
        contents: data.contents,
        thumbnailUrl: data.thumbnailUrl,
        originalUrl: data.originalUrl,
        publishedAt: data.publishedAt,
        state: ContentState.PUBLISHED,
      },
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
      createdAt: {
        gte: startDate,
      },
    };
  }

  /**
   * 정렬 조건 생성
   */
  private getOrderBy(sortBy: StorySortBy) {
    const orderByMap = {
      [StorySortBy.LATEST]: { createdAt: 'desc' as const },
      [StorySortBy.VIEWS]: { viewCount: 'desc' as const },
      [StorySortBy.LIKES]: { likeCount: 'desc' as const },
    };

    return orderByMap[sortBy];
  }
}
