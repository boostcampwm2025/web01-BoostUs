import { Injectable } from '@nestjs/common';
import { CreateQuestionDto } from './dto/req/create-question.dto';
import { QuestionRepository } from './question.repository';

@Injectable()
export class QuestionService {
  constructor(private readonly questionRepo: QuestionRepository) {}

  async create(memberIdStr: string, dto: CreateQuestionDto) {
    const memberId = BigInt(memberIdStr);

    // ✅ DTO → Repository Input
    return this.questionRepo.create({
      memberId,
      title: dto.title,
      contents: dto.contents,
      hashtags: dto.hashtags ?? null,
    });
  }
}
