import { Injectable, NotFoundException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { CursorPayload, decodeCursor, encodeCursor } from '../common/util/cursor.util';
import { FeedRepository } from '../feed/feed.repository';
import { ContentState } from '../generated/prisma/client';
import {
  CreateStoryRequestDto,
  CreateStoryResponseDto,
  StoryListItemDto,
  StoryListRequestDto,
  StoryListResponseDto,
  StoryResponseDto,
} from './dto';
import { StoryRepository } from './story.repository';
import { StorySortBy } from './type/story-query.type';

@Injectable()
export class StoryService {
  constructor(
    private readonly storyRepository: StoryRepository,
    private readonly feedRepository: FeedRepository,
  ) { }

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
          };
          break;
        case StorySortBy.VIEWS:
          cursorPayload = {
            sort: StorySortBy.VIEWS,
            v: lastStory.viewCount,
            id: lastStory.id.toString(),
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
      throw new NotFoundException(`글을 찾을 수 없습니다. id: ${id}`);
    }

    return plainToInstance(StoryResponseDto, story, {
      excludeExtraneousValues: true,
    });
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
      throw new NotFoundException(`피드를 찾을 수 없습니다. feedId: ${dto.feedId}`);
    }

    // Story upsert 및 Feed lastFetchedAt 업데이트 (트랜잭션)
    const story = await this.storyRepository.upsertStoryWithFeedUpdate({
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

    return plainToInstance(CreateStoryResponseDto, story, { excludeExtraneousValues: true });
  }
}
