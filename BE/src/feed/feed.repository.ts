import { Injectable } from '@nestjs/common';
import { Feed, State } from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FeedRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 활성 상태의 모든 피드 조회
   * @returns Feed[]
   */
  async findAllActiveFeeds(): Promise<Feed[]> {
    return this.prisma.feed.findMany({
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
   * @returns Feed | null
   */
  async findFeedById(id: bigint): Promise<Feed | null> {
    return this.prisma.feed.findUnique({
      where: { id },
    });
  }

  /**
   * 피드의 lastFetchedAt 업데이트
   * @param id bigint
   * @returns Feed
   */
  async updateLastFetchedAt(id: bigint): Promise<Feed> {
    return this.prisma.feed.update({
      where: { id },
      data: {
        lastFetchedAt: new Date(),
      },
    });
  }
}
