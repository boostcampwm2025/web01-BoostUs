import { Injectable } from '@nestjs/common';
import { Feeds, State } from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FeedRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 활성 상태의 모든 피드 조회
   * @returns Feeds[]
   */
  async findAllActiveFeeds(): Promise<Feeds[]> {
    return this.prisma.feeds.findMany({
      where: {
        state: State.ACTIVE,
      },
      orderBy: {
        lastFetchedAt: 'asc', // 가장 오래전에 가져온 피드부터
      },
    });
  }

  /**
   * ID로 피드 조회
   * @param id bigint
   * @returns Feeds | null
   */
  async findFeedById(id: bigint): Promise<Feeds | null> {
    return this.prisma.feeds.findUnique({
      where: { id },
    });
  }

  /**
   * 피드의 lastFetchedAt 업데이트
   * @param id bigint
   * @returns Feeds
   */
  async updateLastFetchedAt(id: bigint): Promise<Feeds> {
    return this.prisma.feeds.update({
      where: { id },
      data: {
        lastFetchedAt: new Date(),
      },
    });
  }
}
