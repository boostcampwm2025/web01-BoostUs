import { Body, Controller, Delete, Get, Headers, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBody, ApiHeader, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from '../auth/decorator/public.decorator';
import { CreateQuestionDto } from './dto/req/create-question.dto';
import { QuestionQueryDto } from './dto/req/question-query.dto';
import { QuestionResponseDto } from './dto/res/question-response.dto';
import { QuestionService } from './question.service';
import { QuestionCountDto } from './dto/res/question-count.dto';
import { responseMessage } from '../common/decorator/response-message.decorator';
import { UpdateQuestionDto } from './dto/req/update-question.dto';

@ApiTags('질문')
@Controller('questions')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Post()
  @ApiOperation({
    summary: '질문 생성',
    description: '새로운 질문을 생성합니다.',
  })
  @ApiHeader({
    name: 'memberId',
    description: '작성자 멤버 ID',
    required: true,
  })
  @ApiBody({
    type: CreateQuestionDto,
  })
  @ApiResponse({
    status: 201,
    description: '질문 생성 성공',
    type: QuestionResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: '잘못된 요청',
  })
  create(@Body() createQuestionDto: CreateQuestionDto, @Headers('memberId') memberId: string) {
    return this.questionService.create(memberId, createQuestionDto);
  }

  @Public()
  @Get('count')
  @ApiOperation({
    summary: '전체 질문 수 조회',
    description: '전체 질문의 수를 답변 갯수와 채택 여부를 기준으로 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '질문 상세 갯수 조회 성공',
    type: QuestionCountDto,
  })
  @ApiResponse({
    status: 404,
    description: '질문 갯수를 조회할 수 없음',
  })
  getQuestionsCount() {
    return this.questionService.getQuestionsCount();
  }

  @Public()
  @Get()
  @responseMessage('질문 목록 조회')
  @ApiOperation({
    summary: '질문 목록 조회',
    description:
      '질문 목록을 조회합니다. 상태, 정렬 기준으로 필터링하고 페이지네이션할 수 있습니다.',
  })
  @ApiResponse({
    status: 200,
    description: '질문 목록 조회 성공',
    type: [QuestionResponseDto],
  })
  findAll(@Query() query: QuestionQueryDto) {
    return this.questionService.findAllCursor(query);
  }

  @Public()
  @Get(':id')
  @responseMessage('질문 상세 조회 성공!')
  @ApiOperation({
    summary: '질문 상세 조회',
    description: '특정 질문의 상세 정보를 조회합니다.',
  })
  @ApiParam({
    name: 'id',
    description: '질문 ID',
    example: '1',
  })
  @ApiResponse({
    status: 200,
    description: '질문 상세 조회 성공',
    type: QuestionResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: '질문을 찾을 수 없음',
  })
  async findOne(@Param('id') id: string) {
    return await this.questionService.findOne(id);
  }

  @Patch(':id')
  @responseMessage('질문 수정 성공')
  @ApiOperation({
    summary: '질문 수정',
    description: '기존 질문을 수정합니다.',
  })
  @ApiHeader({
    name: 'memberId',
    description: '작성자 멤버 ID',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: '질문 수정 성공',
    type: QuestionResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: '질문 찾기 실패',
  })
  update(
    @Param('id') id: string,
    @Headers('memberId') memberId: string,
    @Body() UpdateQuestionDto: UpdateQuestionDto,
  ) {
    return this.questionService.update(id, memberId, UpdateQuestionDto);
  }

  @Delete(':id')
  @responseMessage('질문 삭제 성공')
  @ApiHeader({
    name: 'memberId',
    description: '작성자 멤버 ID',
    required: true,
  })
  @ApiOperation({
    summary: '질문 삭제',
    description: '기존 질문을 삭제합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '질문 삭제 성공',
  })
  @ApiResponse({
    status: 404,
    description: '질문을 찾을 수 없음',
  })
  remove(@Param('id') id: string, @Headers('memberId') memberId: string) {
    return this.questionService.delete(id, memberId);
  }

  @Post(':id/answers/:answerId/accept')
  @responseMessage('답변 채택 성공')
  @ApiHeader({
    name: 'memberId',
    description: '작성자 멤버 ID',
    required: true,
  })
  @ApiOperation({
    summary: '답변 채택',
    description: '질문에 달린 답변을 채택합니다.',
  })
  @ApiResponse({ status: 200, description: '답변 채택 성공' })
  @ApiResponse({ status: 404, description: '질문 또는 답변을 찾을 수 없음' })
  accept(
    @Param('id') questionId: string,
    @Param('answerId') answerId: string,
    @Headers('memberId') memberId: string,
  ) {
    return this.questionService.accept(questionId, answerId, memberId);
  }

  @Post(':id/like')
  @responseMessage('질문 좋아요 성공')
  @ApiHeader({
    name: 'memberId',
    description: '작성자 멤버 ID',
    required: true,
  })
  @ApiOperation({
    summary: '질문 좋아요',
    description: '질문에 좋아요를 누릅니다.',
  })
  @ApiResponse({ status: 200, description: '질문 좋아요 성공' })
  @ApiResponse({ status: 404, description: '질문을 찾을 수 없음' })
  async like(@Param('id') questionId: string, @Headers('memberId') memberId: string) {
    return { questionId: await this.questionService.like(questionId, memberId) };
  }

  @Post(':id/dislike')
  @responseMessage('질문 싫어요 성공')
  @ApiHeader({
    name: 'memberId',
    description: '작성자 멤버 ID',
    required: true,
  })
  @ApiOperation({
    summary: '질문 싫어요',
    description: '질문에 싫어요를 누릅니다.',
  })
  @ApiResponse({ status: 200, description: '질문 싫어요 성공' })
  @ApiResponse({ status: 404, description: '질문을 찾을 수 없음' })
  async dislike(@Param('id') questionId: string, @Headers('memberId') memberId: string) {
    return { questionId: await this.questionService.dislike(questionId, memberId) };
  }
}
