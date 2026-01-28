import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from '../auth/decorator/public.decorator';
import { ParseBigIntPipe } from '../common/pipe/parse-bigint.pipe';
import {
  CreateStoryRequestDto,
  CreateStoryResponseDto,
  StoryListRequestDto,
  StoryListResponseDto,
  StoryResponseDto,
} from './dto';
import { StoryService } from './story.service';

@ApiTags('캠퍼들의 이야기')
@Controller('stories')
export class StoryController {
  constructor(private readonly storyService: StoryService) { }

  @Public()
  @Get()
  @ApiOperation({
    summary: '스토리 목록 조회',
    description: '발행된 스토리 목록을 조회합니다. 정렬 기준과 집계 기간을 선택할 수 있습니다.',
  })
  @ApiResponse({
    status: 200,
    description: '스토리 목록 조회 성공',
    type: StoryListResponseDto,
  })
  async getStories(@Query() query: StoryListRequestDto): Promise<StoryListResponseDto> {
    return await this.storyService.findAllPublishedStories(query);
  }

  @Public()
  @Get(':id')
  @ApiOperation({
    summary: '스토리 상세 조회',
    description: '특정 스토리의 상세 정보를 조회합니다.',
  })
  @ApiParam({
    name: 'id',
    description: '스토리 ID',
    example: '1',
    type: 'string',
  })
  @ApiResponse({
    status: 200,
    description: '스토리 상세 조회 성공',
    type: StoryResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: '스토리를 찾을 수 없음',
  })
  async getStory(@Param('id', ParseBigIntPipe) id: bigint): Promise<StoryResponseDto> {
    return await this.storyService.findStoryById(id);
  }

  @Public()
  @Post()
  async createStory(@Body() dto: CreateStoryRequestDto): Promise<CreateStoryResponseDto> {
    return await this.storyService.createStory(dto);
  }
}
