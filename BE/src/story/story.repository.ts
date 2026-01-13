import { Injectable } from '@nestjs/common';
import { ContentState, Story } from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { StoryPeriod, StorySortBy } from './type/story-query.type';

@Injectable()
export class StoryRepository {
  constructor(private readonly prisma: PrismaService) {}

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
