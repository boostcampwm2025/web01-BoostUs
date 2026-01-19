import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ParseBigIntPipe } from '../common/pipe/parse-bigint.pipe';
import {
  CreateStoryRequestDto,
  CreateStoryResponseDto,
  StoryListRequestDto,
  StoryListResponseDto,
  StoryResponseDto,
} from './dto';
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

  @Post()
  async createStory(@Body() dto: CreateStoryRequestDto): Promise<CreateStoryResponseDto> {
    return await this.storyService.createStory(dto);
  }
}
