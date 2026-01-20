import { Body, Controller, Get, Headers, Param, Post, Query } from '@nestjs/common';
import { ApiBody, ApiHeader, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateQuestionDto } from './dto/req/create-question.dto';
import { QuestionQueryDto } from './dto/req/question-query.dto';
import { QuestionResponseDto } from './dto/res/question-response.dto';
import { QuestionService } from './question.service';
import { QuestionCountDto } from './dto/res/question-count.dto';

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

  @Get()
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

  @Get(':id')
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
  findOne(@Param('id') id: string) {
    return this.questionService.findOne(id);
  }
}
