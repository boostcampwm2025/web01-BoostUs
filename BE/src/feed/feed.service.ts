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
import { StoryRepository } from '../story/story.repository';

@Injectable()
export class FeedService {
  constructor(
    private readonly feedRepository: FeedRepository,
    private readonly feedValidatorService: FeedValidatorService,
    private readonly memberRepository: MemberRepository,
    private readonly storyRepository: StoryRepository,
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
   * @param memberId bigint
   * @param dto CreateFeedDto
   * @returns FeedDetailDto
   */
  async create(memberId: bigint, dto: CreateFeedDto): Promise<FeedDetailDto> {
    // 캠퍼 인증 확인 (cohort가 있어야 함)
    const member = await this.memberRepository.findProfileById(memberId);
    if (!member || !member.cohort) {
      throw new UnauthorizedCohortException();
    }

    // RSS URL 유효성 검증
    await this.feedValidatorService.validateFeedUrl(dto.feedUrl);

    // 기존 Feed 조회 (ACTIVE/INACTIVE 상관 없이 조회)
    const existingFeed = await this.feedRepository.findByMemberIdAnyState(memberId);

    let feed: Feed;
    if (existingFeed) {
      // 기존 Feed가 있으면 feedUrl 업데이트 (대체)
      if (existingFeed.state === State.INACTIVE) {
        // 상태 변경 + 스토리 복구 + URL 업데이트를 트랜잭션으로 처리
        feed = await this.feedRepository.reactivateAndRestore(
          existingFeed.id,
          memberId,
          dto.feedUrl,
        );
      } else {
        // ACTIVE 상태면 URL만 업데이트
        feed = await this.feedRepository.updateFeedUrl(existingFeed.id, dto.feedUrl);
      }
    } else {
      // 없으면 새로 생성
      feed = await this.feedRepository.create(memberId, dto.feedUrl);
    }

    return plainToInstance(FeedDetailDto, feed, {
      excludeExtraneousValues: true,
    });
  }

  /**
   * memberId로 피드 조회 (ACTIVE 인 피드만 반환합니다)
   * @param memberId bigint
   * @returns FeedDetailDto | null
   */
  async findByMemberId(memberId: bigint): Promise<FeedDetailDto | null> {
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
   * @param memberId bigint
   * @param dto UpdateFeedDto
   * @returns FeedDetailDto
   */
  async update(id: number, memberId: bigint, dto: UpdateFeedDto): Promise<FeedDetailDto> {
    const feedId = BigInt(id);

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
   * @param memberId bigint
   * @returns void
   */
  async delete(id: number, memberId: bigint): Promise<void> {
    const feedId = BigInt(id);

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

    // 해당 멤버의 stories 소프트 삭제
    await this.storyRepository.softDeleteByMemberId(memberId);
  }
}
