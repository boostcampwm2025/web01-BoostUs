import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { CursorPayload, decodeCursor, encodeCursor } from '../common/util/cursor.util';
import { FeedNotFoundException } from '../feed/exception/feed.exception';
import { FeedRepository } from '../feed/feed.repository';
import { ContentState } from '../generated/prisma/client';
import { ViewService } from '../view/view.service';
import {
  CreateStoryRequestDto,
  CreateStoryResponseDto,
  StoryData,
  StoryListItemDto,
  StoryListRequestDto,
  StoryListResponseDto,
  StoryResponseDto,
} from './dto';
import {
  StoryAlreadyLikedException,
  StoryNotFoundException,
  StoryNotLikedException,
} from './exception/story.exception';
import { StoryRepository } from './story.repository';
import { StorySortBy } from './type/story-query.type';

@Injectable()
export class StoryService {
  constructor(
    private readonly storyRepository: StoryRepository,
    private readonly feedRepository: FeedRepository,
    private readonly viewService: ViewService,
  ) {}

  /**
   * 모든 공개된 캠퍼들의 이야기 목록 조회
   * @param query StoryListRequestDto
   * @returns StoryListResponseDto
   */
  async findAllPublishedStories(query: StoryListRequestDto): Promise<StoryListResponseDto> {
    const { sortBy, period, size, cursor } = query;

    let decodedCursor: CursorPayload | null = null;
    if (cursor) {
      decodedCursor = decodeCursor(cursor);
    }

    const take = size + 1;

    const stories = await this.storyRepository.findAllPublishedStories({
      sortBy,
      period,
      take,
      cursor: decodedCursor ?? undefined,
    });

    const hasNextPage = stories.length > size;
    const pageSize = hasNextPage ? size : stories.length;

    // sortBy에 따라 적절한 CursorPayload 생성
    let nextCursor: string | null = null;
    if (hasNextPage) {
      const lastStory = stories[stories.length - 2];
      let cursorPayload: CursorPayload;

      switch (sortBy) {
        case StorySortBy.LATEST:
          cursorPayload = {
            sort: StorySortBy.LATEST,
            v: lastStory.publishedAt.toISOString(),
            id: lastStory.id.toString(),
          };
          break;
        case StorySortBy.LIKES:
          cursorPayload = {
            sort: StorySortBy.LIKES,
            v: lastStory.likeCount,
            id: lastStory.id.toString(),
            publishedAt: lastStory.publishedAt.toISOString(),
          };
          break;
        case StorySortBy.VIEWS:
          cursorPayload = {
            sort: StorySortBy.VIEWS,
            v: lastStory.viewCount,
            id: lastStory.id.toString(),
            publishedAt: lastStory.publishedAt.toISOString(),
          };
          break;
      }

      nextCursor = encodeCursor(cursorPayload);
    }

    const items = plainToInstance(StoryListItemDto, stories, {
      excludeExtraneousValues: true,
    });

    return {
      items: items.slice(0, size),
      meta: {
        nextCursor,
        hasNextPage,
        pageSize,
      },
    };
  }

  /**
   * ID로 캠퍼들의 이야기 상세 조회
   * @param id bigint
   * @returns StoryResponseDto
   */
  async findStoryById(id: bigint): Promise<StoryResponseDto> {
    const story = await this.storyRepository.findStoryById(id);

    // 글이 없거나 삭제된 상태인 경우 404 에러 발생
    // TODO: 작성자 본인은 비공개 상태의 글도 조회 가능하도록 수정 필요 (state가 PRIVATE인 경우)
    if (!story || story.state !== ContentState.PUBLISHED) {
      throw new StoryNotFoundException(id);
    }

    return plainToInstance(StoryResponseDto, story, {
      excludeExtraneousValues: true,
    });
  }

  /**
   * 스토리 조회수 증가 (viewerKey 기반 중복 방지)
   * @param id bigint
   * @param viewerKey string (bid 쿠키 등)
   */
  async incrementStoryView(id: bigint, viewerKey: string): Promise<void> {
    const storyExists = await this.storyRepository.checkStoryExists(id);
    if (!storyExists) {
      throw new StoryNotFoundException(id);
    }

    const shouldIncrement = await this.viewService.shouldIncrementView(
      'story',
      id,
      viewerKey,
      60 * 60,
    );
    if (shouldIncrement) {
      await this.storyRepository.incrementViewCount(id);
    }
  }

  /**
   * Story 생성 (RSS 크롤러용)
   * @param dto CreateStoryRequestDto
   * @returns CreateStoryResponseDto
   */
  async createStory(dto: CreateStoryRequestDto): Promise<CreateStoryResponseDto> {
    // feedId로 Feed 조회하여 memberId 추출
    const feed = await this.feedRepository.findFeedById(dto.feedId);
    if (!feed) {
      throw new FeedNotFoundException(dto.feedId);
    }

    // Story upsert 및 Feed lastFetchedAt 업데이트 (트랜잭션)
    const result = await this.storyRepository.upsertStoryWithFeedUpdate({
      guid: dto.guid,
      memberId: feed.memberId,
      feedId: feed.id,
      title: dto.title,
      summary: dto.summary,
      contents: dto.contents,
      thumbnailUrl: dto.thumbnailUrl,
      originalUrl: dto.originalUrl,
      publishedAt: dto.publishedAt,
    });

    return {
      story: plainToInstance(StoryData, result.story, { excludeExtraneousValues: true }),
      meta: {
        operation: result.operation,
        isNewStory: result.isNewStory,
        hasChanges: result.hasChanges,
      },
    };
  }

  /**
   * 캠퍼들의 이야기 좋아요 등록
   * @param storyId bigint
   * @param memberId string
   * @returns bigint (storyId)
   */
  async likeStory(storyId: bigint, memberId: bigint): Promise<bigint> {
    // Story 존재 여부 확인
    const storyExists = await this.storyRepository.checkStoryExists(storyId);
    if (!storyExists) {
      throw new StoryNotFoundException(storyId);
    }

    // 이미 좋아요한 경우 확인
    const alreadyLiked = await this.storyRepository.checkStoryLikeExists(storyId, memberId);
    if (alreadyLiked) {
      throw new StoryAlreadyLikedException(storyId);
    }

    // 좋아요 등록
    await this.storyRepository.likeStory(storyId, memberId);

    return storyId;
  }

  /**
   * 캠퍼들의 이야기 좋아요 취소
   * @param storyId bigint
   * @param memberId bigint
   * @returns bigint (storyId)
   */
  async unlikeStory(storyId: bigint, memberId: bigint): Promise<bigint> {
    // Story 존재 여부 확인
    const storyExists = await this.storyRepository.checkStoryExists(storyId);
    if (!storyExists) {
      throw new StoryNotFoundException(storyId);
    }

    // 좋아요하지 않은 경우 확인
    const notLiked = !(await this.storyRepository.checkStoryLikeExists(storyId, memberId));
    if (notLiked) {
      throw new StoryNotLikedException(storyId);
    }

    // 좋아요 취소
    await this.storyRepository.unlikeStory(storyId, memberId);

    return storyId;
  }

  /**
   * 캠퍼들의 이야기 좋아요 상태 확인
   * @param storyId bigint
   * @param memberId bigint
   * @returns boolean
   */
  async checkStoryLikeStatus(storyId: bigint, memberId: bigint): Promise<boolean> {
    // Story 존재 여부 확인
    const storyExists = await this.storyRepository.checkStoryExists(storyId);
    if (!storyExists) {
      throw new StoryNotFoundException(storyId);
    }

    // 좋아요 상태 확인
    return await this.storyRepository.checkStoryLikeExists(storyId, memberId);
  }
}
