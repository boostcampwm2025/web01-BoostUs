import { Controller, Post, Body, Patch, Param, Delete, Headers, Query } from '@nestjs/common';
import { ApiTags, ApiHeader, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AnswerService } from './answer.service';
import { CreateAnswerDto } from './dto/req/create-answer.dto';
import { UpdateAnswerDto } from './dto/req/update-answer.dto';
import { AnswerResponseDto } from './dto/res/answer-response.dto';
import { responseMessage } from '../common/decorator/response-message.decorator';
import { CurrentMember } from 'src/auth/decorator/current-member.decorator';
@ApiTags('답변')
@Controller('answers')
export class AnswerController {
  constructor(private readonly answerService: AnswerService) {}

  @Post()
  @responseMessage('답변 생성 성공')
  @ApiOperation({
    summary: '답변 생성',
    description: '새로운 답변을 생성합니다.',
  })
  @ApiHeader({
    name: 'memberId',
    description: '작성자 멤버 ID',
    required: true,
  })
  @ApiBody({
    type: CreateAnswerDto,
  })
  @ApiResponse({
    status: 201,
    description: '답변 생성 성공',
    type: AnswerResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: '잘못된 요청',
  })
  create(
    @Query('qid') qid: string,
    @Headers('memberId') @CurrentMember() memberId: string,
    @Body() createAnswerDto: CreateAnswerDto,
  ) {
    return this.answerService.create(memberId, qid, createAnswerDto);
  }

  @Patch(':id')
  @responseMessage('답변 수정 성공')
  @ApiOperation({
    summary: '답변 수정',
    description: '기존 답변을 수정합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '답변 수정 성공',
    type: AnswerResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: '답변 찾기 실패',
  })
  update(
    @Param('id') id: string,
    @Headers('memberId') @CurrentMember() memberId: string,
    @Body() updateAnswerDto: UpdateAnswerDto,
  ) {
    return this.answerService.update(id, memberId, updateAnswerDto);
  }

  @Delete(':id')
  @responseMessage('답변 삭제 성공')
  @ApiOperation({
    summary: '답변 삭제',
    description: '기존 답변을 삭제합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '답변 삭제 성공',
  })
  @ApiResponse({
    status: 404,
    description: '답변을 찾을 수 없음',
  })
  remove(@Param('id') id: string, @Headers('memberId') @CurrentMember() memberId: string) {
    return this.answerService.delete(id, memberId);
  }

  @Post(':id/like')
  @responseMessage('답변 좋아요 성공')
  @ApiHeader({
    name: 'memberId',
    description: '작성자 멤버 ID',
    required: true,
  })
  @ApiOperation({
    summary: '답변 좋아요',
    description: '답변에 좋아요를 누릅니다.',
  })
  @ApiResponse({ status: 200, description: '답변 좋아요 성공' })
  @ApiResponse({ status: 404, description: '답변을 찾을 수 없음' })
  async like(
    @Param('id') answerId: string,
    @Headers('memberId') @CurrentMember() memberId: string,
  ) {
    return { answerId: await this.answerService.like(answerId, memberId) };
  }

  @Post(':id/dislike')
  @responseMessage('답변 싫어요 성공')
  @ApiHeader({
    name: 'memberId',
    description: '작성자 멤버 ID',
    required: true,
  })
  @ApiOperation({
    summary: '답변 싫어요',
    description: '답변에 싫어요를 누릅니다.',
  })
  @ApiResponse({ status: 200, description: '답변 싫어요 성공' })
  @ApiResponse({ status: 404, description: '답변을 찾을 수 없음' })
  async dislike(
    @Param('id') answerId: string,
    @Headers('memberId') @CurrentMember() memberId: string,
  ) {
    return { answerId: await this.answerService.dislike(answerId, memberId) };
  }
}
