import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { StoryListItemDto, StoryListRequestDto, StoryListResponseDto } from './dto';
import { StoryRepository } from './story.repository';

@Injectable()
export class StoryService {
  constructor(private readonly storyRepository: StoryRepository) {}

  async findAllPublishedStories(query: StoryListRequestDto): Promise<StoryListResponseDto> {
    const { sortBy, period } = query;

    const stories = await this.storyRepository.findAllPublishedStories(sortBy, period);

    // 엔티티를 DTO로 변환 (excludeExtraneousValues: @Expose()가 없는 필드 제외)
    const items = plainToInstance(StoryListItemDto, stories, {
      excludeExtraneousValues: true,
    });

    return {
      items,
      meta: {}, // TODO: 페이지네이션 메타 정보 추가
    };
  }
}
