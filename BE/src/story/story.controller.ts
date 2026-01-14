import { Controller, Get, Param, Query } from '@nestjs/common';
import { ParseBigIntPipe } from '../common/pipe/parse-bigint.pipe';
import { StoryListRequestDto, StoryListResponseDto, StoryResponseDto } from './dto';
import { StoryService } from './story.service';

@Controller('stories')
export class StoryController {
  constructor(private readonly storyService: StoryService) {}

  @Get()
  async getStories(@Query() query: StoryListRequestDto): Promise<StoryListResponseDto> {
    return await this.storyService.findAllPublishedStories(query);
  }

  @Get(':id')
  async getStory(@Param('id', ParseBigIntPipe) id: bigint): Promise<StoryResponseDto> {
    return await this.storyService.findStoryById(id);
  }
}
