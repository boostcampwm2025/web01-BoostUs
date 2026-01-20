import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { FeedListItemDto, FeedListResponseDto } from './dto';
import { FeedRepository } from './feed.repository';

@Injectable()
export class FeedService {
  constructor(private readonly feedRepository: FeedRepository) {}

  /**
   * 활성 상태의 모든 피드 목록 조회
   * @returns FeedListResponseDto
   */
  async findAllActiveFeeds(): Promise<FeedListResponseDto> {
    const feeds = await this.feedRepository.findAllActiveFeeds();

    const items = plainToInstance(FeedListItemDto, feeds, {
      excludeExtraneousValues: true,
    });

    return { items };
  }

  /**
   * 피드의 lastFetchedAt 업데이트
   * @param id bigint
   */
  async updateLastFetchedAt(id: bigint): Promise<void> {
    await this.feedRepository.updateLastFetchedAt(id);
  }
}
