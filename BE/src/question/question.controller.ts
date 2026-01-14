import { Controller, Get, Post, Body, Patch, Param, Delete, Headers } from '@nestjs/common';
import { QuestionService } from './question.service';
import { CreateQuestionDto } from './dto/req/create-question.dto';
@Controller('question')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Post()
  create(@Body() createQuestionDto: CreateQuestionDto, @Headers('memberId') memberId: string) {
    return this.questionService.create(memberId, createQuestionDto);
  }
}
