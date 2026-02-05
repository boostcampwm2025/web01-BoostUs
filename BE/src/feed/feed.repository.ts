import { Injectable } from '@nestjs/common';
import { ContentState, Feed, State } from '../generated/prisma/client';
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

  /**
   * memberId로 피드 조회 (ACTIVE 인 피드만 반환합니다)
   * @param memberId bigint
   * @returns Feed | null
   */
  async findByMemberId(memberId: bigint): Promise<Feed | null> {
    return this.prisma.feed.findFirst({
      where: { memberId, state: State.ACTIVE },
    });
  }

  /**
   * memberId로 피드 조회 (ACTIVE/INACTIVE 인 피드 모두 반환합니다)
   * @param memberId bigint
   * @returns Feed | null
   */
  async findByMemberIdAnyState(memberId: bigint): Promise<Feed | null> {
    return this.prisma.feed.findFirst({
      where: { memberId },
    });
  }

  /**
   * 피드 생성
   * @param memberId bigint
   * @param feedUrl string
   * @returns Feed
   */
  async create(memberId: bigint, feedUrl: string): Promise<Feed> {
    return this.prisma.feed.create({
      data: {
        memberId,
        feedUrl,
        state: State.ACTIVE,
      },
    });
  }

  /**
   * 피드 URL 업데이트
   * @param id bigint
   * @param feedUrl string
   * @returns Feed
   */
  async updateFeedUrl(id: bigint, feedUrl: string): Promise<Feed> {
    return this.prisma.feed.update({
      where: { id },
      data: { feedUrl },
    });
  }

  /**
   * 피드 상태 업데이트
   * @param id bigint
   * @param state State
   * @returns Feed
   */
  async updateState(id: bigint, state: State): Promise<Feed> {
    return this.prisma.feed.update({
      where: { id },
      data: { state },
    });
  }

  /**
   * 피드 존재 여부 확인
   * @param id bigint
   * @returns boolean
   */
  async exists(id: bigint): Promise<boolean> {
    const feed = await this.prisma.feed.findUnique({
      where: { id },
      select: { id: true },
    });
    return feed !== null;
  }

  /**
   * INACTIVE 피드를 ACTIVE로 재활성화 + stories 복구 + URL 업데이트 (트랜잭션)
   * @param feedId bigint
   * @param memberId bigint
   * @param feedUrl string
   * @returns Feed
   */
  async reactivateAndRestore(
    feedId: bigint,
    memberId: bigint,
    feedUrl: string,
  ): Promise<Feed> {
    return this.prisma.$transaction(async (tx) => {
      // 1. Feed 상태를 ACTIVE로 변경 + URL 업데이트
      const feed = await tx.feed.update({
        where: { id: feedId },
        data: {
          state: State.ACTIVE,
          feedUrl,
        },
      });

      // 2. 해당 멤버의 DELETED 상태 stories를 PUBLISHED로 복구
      await tx.story.updateMany({
        where: {
          memberId,
          state: ContentState.DELETED,
        },
        data: {
          state: ContentState.PUBLISHED,
        },
      });

      return feed;
    });
  }
}
