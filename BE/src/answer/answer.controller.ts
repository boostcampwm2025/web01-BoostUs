import { Controller, Post, Body, Patch, Param, Delete, Headers, Query } from '@nestjs/common';
import { ApiTags, ApiHeader, ApiOperation, ApiParam, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AnswerService } from './answer.service';
import { CreateAnswerDto } from './dto/req/create-answer.dto';
import { UpdateAnswerDto } from './dto/update-answer.dto';
import { AnswerResponseDto } from './dto/res/answer-response.dto';
@ApiTags('답변')
@Controller('answer')
export class AnswerController {
  constructor(private readonly answerService: AnswerService) {}

  @Post()
  @ApiOperation({
    summary: '답변 생성',
    description: '새로운 답변을 생성합니다.',
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer 토큰',
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
    @Headers('memberId') memberId: string,
    @Body() createAnswerDto: CreateAnswerDto,
  ) {
    console.log({ memberId, qid, headers: '...' });

    return this.answerService.create(memberId, qid, createAnswerDto);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateAnswerDto: UpdateAnswerDto) {
  //   return this.answerService.update(+id, updateAnswerDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.answerService.remove(+id);
  }
}
