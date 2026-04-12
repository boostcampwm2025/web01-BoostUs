import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '../auth/decorator/public.decorator';
import { CreateQuestionDto } from './dto/req/create-question.dto';
import { QuestionQueryDto } from './dto/req/question-query.dto';
import { QuestionResponseDto } from './dto/res/detail/question-response.dto';
import { QuestionService } from './question.service';
import { responseMessage } from '../common/decorator/response-message.decorator';
import { UpdateQuestionDto } from './dto/req/update-question.dto';
import { CurrentMember } from 'src/auth/decorator/current-member.decorator';
import { ViewerKeyGuard } from 'src/view/guard/view.guard';
import { ViewerKey } from 'src/view/decorator/viewer-key.decorator';
import { ParseBigIntPipe } from 'src/common/pipe/parse-bigint.pipe';
import { QuestionCursorResponseDto } from './dto/res/all/question-list.dto';
import { QuestionDetailItemDto } from './dto/res/detail/question-detail-item.dto';
import {
  AcceptAnswerSwagger,
  CreateQuestionSwagger,
  DeleteQuestionSwagger,
  DislikeQuestionSwagger,
  GetQuestionSwagger,
  GetQuestionsCountSwagger,
  GetQuestionsSwagger,
  LikeQuestionSwagger,
  UpdateQuestionSwagger,
} from 'src/config/swagger/question-swagger.decorator';

@ApiTags('질문')
@Controller('questions')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Post()
  @CreateQuestionSwagger()
  create(@Body() createQuestionDto: CreateQuestionDto, @CurrentMember() memberId: string) {
    return this.questionService.create(memberId, createQuestionDto);
  }

  @Public()
  @Get('count')
  @GetQuestionsCountSwagger()
  getQuestionsCount() {
    return this.questionService.getQuestionsCount();
  }

  @Public()
  @Get()
  @responseMessage('질문 목록 조회')
  @GetQuestionsSwagger()
  findAll(@Query() query: QuestionQueryDto, @CurrentMember() memberId?: string) {
    return this.questionService.findAllCursor(query, memberId);
  }

  @Public()
  @Get(':id')
  @responseMessage('질문 상세 조회 성공!')
  @GetQuestionSwagger()
  async findOne(@Param('id') id: string, @CurrentMember() memberId?: string) {
    return await this.questionService.findOne(id, memberId);
  }

  @Public()
  @Post(':id/view')
  @UseGuards(ViewerKeyGuard)
  async incrementStoryView(
    @Param('id', ParseBigIntPipe) id: bigint,
    @ViewerKey() viewerKey: string,
  ): Promise<void> {
    await this.questionService.incrementStoryView(id, viewerKey);
  }

  @Patch(':id')
  @responseMessage('질문 수정 성공')
  @UpdateQuestionSwagger()
  update(
    @Param('id') id: string,
    @CurrentMember() memberId: string,
    @Body() UpdateQuestionDto: UpdateQuestionDto,
  ) {
    return this.questionService.update(id, memberId, UpdateQuestionDto);
  }

  @Delete(':id')
  @responseMessage('질문 삭제 성공')
  @DeleteQuestionSwagger()
  remove(@Param('id') id: string, @CurrentMember() memberId: string) {
    return this.questionService.delete(id, memberId);
  }

  @Post(':id/answers/:answerId/accept')
  @responseMessage('답변 채택 성공')
  @AcceptAnswerSwagger()
  accept(
    @Param('id') questionId: string,
    @Param('answerId') answerId: string,
    @CurrentMember() memberId: string,
  ) {
    return this.questionService.accept(questionId, answerId, memberId);
  }

  @Post(':id/like')
  @responseMessage('질문 좋아요 성공')
  @LikeQuestionSwagger()
  async like(@Param('id') questionId: string, @CurrentMember() memberId: string) {
    return { questionId: await this.questionService.like(questionId, memberId) };
  }

  @Post(':id/dislike')
  @responseMessage('질문 싫어요 성공')
  @DislikeQuestionSwagger()
  async dislike(@Param('id') questionId: string, @CurrentMember() memberId: string) {
    return { questionId: await this.questionService.dislike(questionId, memberId) };
  }
}
