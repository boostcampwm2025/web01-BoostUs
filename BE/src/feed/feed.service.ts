import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Feed, State } from '../generated/prisma/client';
import {
  CreateFeedDto,
  FeedDetailDto,
  FeedListItemDto,
  FeedListResponseDto,
  UpdateFeedDto,
} from './dto';
import {
  FeedForbiddenException,
  FeedNotFoundException,
  UnauthorizedCohortException,
} from './exception/feed.exception';
import { FeedValidatorService } from './feed-validator.service';
import { FeedRepository } from './feed.repository';
import { MemberRepository } from '../member/member.repository';

@Injectable()
export class FeedService {
  constructor(
    private readonly feedRepository: FeedRepository,
    private readonly feedValidatorService: FeedValidatorService,
    private readonly memberRepository: MemberRepository,
  ) {}

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

  /**
   * RSS 피드 생성 (기존 피드가 있으면 대체)
   * @param memberIdStr string
   * @param dto CreateFeedDto
   * @returns FeedDetailDto
   */
  async create(memberIdStr: string, dto: CreateFeedDto): Promise<FeedDetailDto> {
    const memberId = BigInt(memberIdStr);

    // 캠퍼 인증 확인 (cohort가 있어야 함)
    const member = await this.memberRepository.findProfileById(memberIdStr);
    if (!member || !member.cohort) {
      throw new UnauthorizedCohortException();
    }

    // RSS URL 유효성 검증
    await this.feedValidatorService.validateFeedUrl(dto.feedUrl);

    // 기존 Feed 조회
    const existingFeed = await this.feedRepository.findByMemberId(memberId);

    let feed: Feed;
    if (existingFeed) {
      // 기존 Feed가 있으면 feedUrl 업데이트 (대체)
      if (existingFeed.state === State.INACTIVE) {
        await this.feedRepository.updateState(existingFeed.id, State.ACTIVE);
      }
      feed = await this.feedRepository.updateFeedUrl(existingFeed.id, dto.feedUrl);
    } else {
      // 없으면 새로 생성
      feed = await this.feedRepository.create(memberId, dto.feedUrl);
    }

    return plainToInstance(FeedDetailDto, feed, {
      excludeExtraneousValues: true,
    });
  }

  /**
   * memberId로 피드 조회
   * @param memberIdStr string
   * @returns FeedDetailDto | null
   */
  async findByMemberId(memberIdStr: string): Promise<FeedDetailDto | null> {
    const memberId = BigInt(memberIdStr);
    const feed = await this.feedRepository.findByMemberId(memberId);

    if (!feed) {
      return null;
    }

    return plainToInstance(FeedDetailDto, feed, {
      excludeExtraneousValues: true,
    });
  }

  /**
   * RSS 피드 수정
   * @param id number
   * @param memberIdStr string
   * @param dto UpdateFeedDto
   * @returns FeedDetailDto
   */
  async update(id: number, memberIdStr: string, dto: UpdateFeedDto): Promise<FeedDetailDto> {
    const feedId = BigInt(id);
    const memberId = BigInt(memberIdStr);

    // Feed 존재 여부 확인
    const feed = await this.feedRepository.findFeedById(feedId);
    if (!feed) {
      throw new FeedNotFoundException(feedId);
    }

    // Feed 소유자 확인
    if (feed.memberId !== memberId) {
      throw new FeedForbiddenException('수정');
    }

    // RSS URL 유효성 검증
    await this.feedValidatorService.validateFeedUrl(dto.feedUrl);

    // feedUrl 업데이트
    const updatedFeed = await this.feedRepository.updateFeedUrl(feedId, dto.feedUrl);

    return plainToInstance(FeedDetailDto, updatedFeed, {
      excludeExtraneousValues: true,
    });
  }

  /**
   * RSS 피드 삭제 (state를 INACTIVE로 변경)
   * @param id number
   * @param memberIdStr string
   * @returns void
   */
  async delete(id: number, memberIdStr: string): Promise<void> {
    const feedId = BigInt(id);
    const memberId = BigInt(memberIdStr);

    // Feed 존재 여부 확인
    const feed = await this.feedRepository.findFeedById(feedId);
    if (!feed) {
      throw new FeedNotFoundException(feedId);
    }

    // Feed 소유자 확인
    if (feed.memberId !== memberId) {
      throw new FeedForbiddenException('삭제');
    }

    // state를 INACTIVE로 변경 (soft delete)
    await this.feedRepository.updateState(feedId, State.INACTIVE);
  }
}
