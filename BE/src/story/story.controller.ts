import { Body, Controller, Delete, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CurrentMember } from '../auth/decorator/current-member.decorator';
import { Public } from '../auth/decorator/public.decorator';
import { ParseBigIntPipe } from '../common/pipe/parse-bigint.pipe';
import { ViewerKey } from '../view/decorator/viewer-key.decorator';
import { ViewerKeyGuard } from '../view/guard/view.guard';
import {
  CreateStoryRequestDto,
  CreateStoryResponseDto,
  StoryListRequestDto,
  StoryListResponseDto,
  StoryResponseDto,
} from './dto';
import { StoryService } from './story.service';
import {
  CheckStoryLikeStatusSwagger,
  CreateStorySwagger,
  GetStoriesSwagger,
  GetStorySwagger,
  IncrementStoryViewSwagger,
  LikeStorySwagger,
  UnlikeStorySwagger,
} from 'src/config/swagger/story-swagger.decorator';

@ApiTags('캠퍼들의 이야기')
@Controller('stories')
export class StoryController {
  constructor(private readonly storyService: StoryService) {}

  @Public()
  @Get()
  @GetStoriesSwagger()
  async getStories(@Query() query: StoryListRequestDto): Promise<StoryListResponseDto> {
    return await this.storyService.findAllPublishedStories(query);
  }

  @Public()
  @Get(':id')
  @GetStorySwagger()
  async getStory(@Param('id', ParseBigIntPipe) id: bigint): Promise<StoryResponseDto> {
    return await this.storyService.findStoryById(id);
  }

  @Public()
  @Post(':id/view')
  @UseGuards(ViewerKeyGuard)
  @IncrementStoryViewSwagger()
  incrementStoryView(
    @Param('id', ParseBigIntPipe) id: bigint,
    @ViewerKey() viewerKey: string,
  ): void {
    void this.storyService.incrementStoryView(id, viewerKey);
  }

  @Public()
  @Post()
  @CreateStorySwagger()
  async createStory(@Body() dto: CreateStoryRequestDto): Promise<CreateStoryResponseDto> {
    return await this.storyService.createStory(dto);
  }

  @Post(':id/like')
  @LikeStorySwagger()
  async likeStory(
    @Param('id', ParseBigIntPipe) id: bigint,
    @CurrentMember() memberId: bigint,
  ): Promise<{ storyId: bigint }> {
    const storyId = await this.storyService.likeStory(id, memberId);
    return { storyId };
  }

  @Delete(':id/like')
  @UnlikeStorySwagger()
  async unlikeStory(
    @Param('id', ParseBigIntPipe) id: bigint,
    @CurrentMember() memberId: bigint,
  ): Promise<{ storyId: bigint }> {
    const storyId = await this.storyService.unlikeStory(id, memberId);
    return { storyId };
  }

  @Get(':id/like/status')
  @CheckStoryLikeStatusSwagger()
  async checkStoryLikeStatus(
    @Param('id', ParseBigIntPipe) id: bigint,
    @CurrentMember() memberId: bigint,
  ): Promise<{ isLiked: boolean }> {
    const isLiked = await this.storyService.checkStoryLikeStatus(id, memberId);
    return { isLiked };
  }
}
