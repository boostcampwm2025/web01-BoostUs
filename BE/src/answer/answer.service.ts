import { Injectable } from '@nestjs/common';
import { CreateAnswerDto } from './dto/req/create-answer.dto';
import { AnswerRepository } from './answer.repositiory';
import { AnswerResponseDto } from './dto/res/answer-response.dto';

@Injectable()
export class AnswerService {
  constructor(private readonly answerRepo: AnswerRepository) {}

  async create(
    memberIdStr: string,
    questionIdStr: string,
    createAnswerDto: CreateAnswerDto,
  ): Promise<AnswerResponseDto> {
    const created = await this.answerRepo.create({
      memberId: BigInt(memberIdStr),
      questionId: BigInt(questionIdStr),
      contents: createAnswerDto.contents,
    });

    return {
      id: created.id.toString(),
      contents: created.contents,
      isAccepted: created.isAccepted,
      upCount: created.upCount,
      downCount: created.downCount,
      state: created.state,
      createdAt: created.createdAt.toISOString(),
      updatedAt: created.updatedAt.toISOString(),
      user: {
        id: created.member.id.toString(),
        nickname: created.member.nickname,
        avatarUrl: created.member.avatarUrl,
        cohort: created.member.cohort,
      },
    };
  }

  // update(id: number, updateAnswerDto: UpdateAnswerDto) {
  //   return `This action updates a #${id} answer`;
  // }

  remove(id: number) {
    return `This action removes a #${id} answer`;
  }
}
