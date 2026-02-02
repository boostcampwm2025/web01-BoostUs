import { Body, Controller, Delete, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ViewerKey } from '../view/decorator/viewer-key.decorator';
import { CurrentMember } from '../auth/decorator/current-member.decorator';
import { Public } from '../auth/decorator/public.decorator';
import { ParseBigIntPipe } from '../common/pipe/parse-bigint.pipe';
import { ViewerKeyGuard } from '../view/guard/view.guard';
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
  constructor(private readonly storyService: StoryService) {}

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
    description:
      '특정 스토리의 상세 정보를 조회합니다. 조회수 증가는 POST /stories/:id/view 를 사용하세요.',
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
  @Post(':id/view')
  @UseGuards(ViewerKeyGuard)
  @ApiOperation({
    summary: '스토리 조회수 증가',
    description:
      '특정 스토리의 조회수를 1 증가시킵니다. bid 쿠키 기반으로 동일 뷰어의 중복 증가를 방지합니다.',
  })
  @ApiParam({
    name: 'id',
    description: '스토리 ID',
    example: '1',
    type: 'string',
  })
  @ApiResponse({
    status: 201,
    description: '조회수 증가 처리 완료',
  })
  @ApiResponse({
    status: 404,
    description: '스토리를 찾을 수 없음',
  })
  async incrementStoryView(
    @Param('id', ParseBigIntPipe) id: bigint,
    @ViewerKey() viewerKey: string,
  ): Promise<void> {
    await this.storyService.incrementStoryView(id, viewerKey);
  }

  @Public()
  @Post()
  async createStory(@Body() dto: CreateStoryRequestDto): Promise<CreateStoryResponseDto> {
    return await this.storyService.createStory(dto);
  }

  @Post(':id/like')
  @ApiOperation({
    summary: '캠퍼들의 이야기 좋아요 등록',
    description: '로그인한 사용자가 캠퍼들의 이야기에 좋아요를 등록합니다.',
  })
  @ApiParam({
    name: 'id',
    description: '스토리 ID',
    example: '1',
    type: 'string',
  })
  @ApiResponse({
    status: 200,
    description: '좋아요 등록 성공',
    schema: {
      type: 'object',
      properties: {
        storyId: {
          type: 'string',
          example: '1',
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: '인증 실패',
  })
  @ApiResponse({
    status: 404,
    description: '스토리를 찾을 수 없음',
  })
  @ApiResponse({
    status: 409,
    description: '이미 좋아요한 상태',
  })
  async likeStory(
    @Param('id', ParseBigIntPipe) id: bigint,
    @CurrentMember() memberId: string,
  ): Promise<{ storyId: string }> {
    return { storyId: await this.storyService.likeStory(id, memberId) };
  }

  @Delete(':id/like')
  @ApiOperation({
    summary: '캠퍼들의 이야기 좋아요 취소',
    description: '로그인한 사용자가 캠퍼들의 이야기 좋아요를 취소합니다.',
  })
  @ApiParam({
    name: 'id',
    description: '스토리 ID',
    example: '1',
    type: 'string',
  })
  @ApiResponse({
    status: 200,
    description: '좋아요 취소 성공',
    schema: {
      type: 'object',
      properties: {
        storyId: {
          type: 'string',
          example: '1',
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: '인증 실패',
  })
  @ApiResponse({
    status: 404,
    description: '스토리를 찾을 수 없음',
  })
  @ApiResponse({
    status: 400,
    description: '좋아요하지 않은 상태',
  })
  async unlikeStory(
    @Param('id', ParseBigIntPipe) id: bigint,
    @CurrentMember() memberId: string,
  ): Promise<{ storyId: string }> {
    return { storyId: await this.storyService.unlikeStory(id, memberId) };
  }

  @Get(':id/like/status')
  @ApiOperation({
    summary: '캠퍼들의 이야기 좋아요 상태 확인',
    description: '로그인한 사용자가 특정 스토리에 좋아요를 눌렀는지 확인합니다.',
  })
  @ApiParam({
    name: 'id',
    description: '스토리 ID',
    example: '1',
    type: 'string',
  })
  @ApiResponse({
    status: 200,
    description: '좋아요 상태 확인 성공',
    schema: {
      type: 'object',
      properties: {
        isLiked: {
          type: 'boolean',
          example: true,
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: '인증 실패',
  })
  @ApiResponse({
    status: 404,
    description: '스토리를 찾을 수 없음',
  })
  async checkStoryLikeStatus(
    @Param('id', ParseBigIntPipe) id: bigint,
    @CurrentMember() memberId: string,
  ): Promise<{ isLiked: boolean }> {
    const isLiked = await this.storyService.checkStoryLikeStatus(id, memberId);
    return { isLiked };
  }
}
