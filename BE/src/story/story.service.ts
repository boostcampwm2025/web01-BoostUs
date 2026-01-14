import { Injectable, NotFoundException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { ContentState } from '../generated/prisma/client';
import {
  StoryListItemDto,
  StoryListRequestDto,
  StoryListResponseDto,
  StoryResponseDto,
} from './dto';
import { StoryRepository } from './story.repository';

@Injectable()
export class StoryService {
  constructor(private readonly storyRepository: StoryRepository) {}

  /**
   * 모든 공개된 캠퍼들의 이야기 목록 조회
   * @param query StoryListRequestDto
   * @returns StoryListResponseDto
   */
  async findAllPublishedStories(query: StoryListRequestDto): Promise<StoryListResponseDto> {
    const { sortBy, period } = query;

    const stories = await this.storyRepository.findAllPublishedStories(sortBy, period);

    const items = plainToInstance(StoryListItemDto, stories, {
      excludeExtraneousValues: true,
    });

    return {
      items,
      meta: {}, // TODO: 페이지네이션 메타 정보 추가
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
}
