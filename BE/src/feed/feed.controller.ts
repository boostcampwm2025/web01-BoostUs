import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger';
import { CurrentMember } from '../auth/decorator/current-member.decorator';
import { Public } from '../auth/decorator/public.decorator';
import {
  CreateFeedDto,
  FeedDetailDto,
  FeedListResponseDto,
  UpdateFeedDto,
} from './dto';
import { FeedService } from './feed.service';

@ApiTags('RSS 피드')
@Controller('feeds')
export class FeedController {
  constructor(private readonly feedService: FeedService) { }

  @Public()
  @Get()
  @ApiOperation({
    summary: '활성 RSS 피드 목록 조회',
    description: '활성 상태의 모든 RSS 피드 목록을 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: 'RSS 피드 목록 조회 성공',
    type: FeedListResponseDto,
  })
  async getFeeds(): Promise<FeedListResponseDto> {
    return await this.feedService.findAllActiveFeeds();
  }

  @Post()
  @ApiOperation({
    summary: 'RSS 피드 생성',
    description:
      '새로운 RSS 피드를 생성합니다. 기존 피드가 있으면 자동으로 대체됩니다.',
  })
  @ApiBody({
    type: CreateFeedDto,
  })
  @ApiResponse({
    status: 201,
    description: 'RSS 피드 생성 성공',
    type: FeedDetailDto,
  })
  @ApiResponse({
    status: 400,
    description: '잘못된 요청 (RSS URL 형식 오류 또는 접근 불가)',
  })
  async create(
    @Body() createFeedDto: CreateFeedDto,
    @CurrentMember() memberId: string,
  ): Promise<FeedDetailDto> {
    return await this.feedService.create(memberId, createFeedDto);
  }

  @Get('me')
  @ApiOperation({
    summary: '현재 사용자 RSS 피드 조회',
    description: '현재 로그인한 사용자의 RSS 피드를 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: 'RSS 피드 조회 성공',
    type: FeedDetailDto,
  })
  @ApiResponse({
    status: 404,
    description: 'RSS 피드를 찾을 수 없음',
  })
  async getMyFeed(
    @CurrentMember() memberId: string,
  ): Promise<FeedDetailDto | null> {
    return await this.feedService.findByMemberId(memberId);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'RSS 피드 수정',
    description: '특정 RSS 피드의 URL을 수정합니다.',
  })
  @ApiParam({
    name: 'id',
    description: 'RSS 피드 ID',
    example: 1,
  })
  @ApiBody({
    type: UpdateFeedDto,
  })
  @ApiResponse({
    status: 200,
    description: 'RSS 피드 수정 성공',
    type: FeedDetailDto,
  })
  @ApiResponse({
    status: 400,
    description: '잘못된 요청 (RSS URL 형식 오류 또는 접근 불가)',
  })
  @ApiResponse({
    status: 403,
    description: '권한 없음 (피드 소유자가 아님)',
  })
  @ApiResponse({
    status: 404,
    description: 'RSS 피드를 찾을 수 없음',
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @CurrentMember() memberId: string,
    @Body() updateFeedDto: UpdateFeedDto,
  ): Promise<FeedDetailDto> {
    return await this.feedService.update(id, memberId, updateFeedDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'RSS 피드 삭제',
    description: '특정 RSS 피드를 삭제합니다. (state를 INACTIVE로 변경)',
  })
  @ApiParam({
    name: 'id',
    description: 'RSS 피드 ID',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'RSS 피드 삭제 성공',
  })
  @ApiResponse({
    status: 403,
    description: '권한 없음 (피드 소유자가 아님)',
  })
  @ApiResponse({
    status: 404,
    description: 'RSS 피드를 찾을 수 없음',
  })
  async delete(
    @Param('id', ParseIntPipe) id: number,
    @CurrentMember() memberId: string,
  ): Promise<void> {
    return await this.feedService.delete(id, memberId);
  }
}
