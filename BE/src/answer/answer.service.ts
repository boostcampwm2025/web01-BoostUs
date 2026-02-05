import { ForbiddenException, NotFoundException, Injectable } from '@nestjs/common';
import { CreateAnswerDto } from './dto/req/create-answer.dto';
import { AnswerRepository } from './answer.repository';
import { AnswerResponseDto } from './dto/res/answer-response.dto';
import { UpdateAnswerDto } from './dto/req/update-answer.dto';
import { AuthRepository } from 'src/auth/auth.repository';
import { Role } from 'src/generated/prisma/enums';

@Injectable()
export class AnswerService {
  constructor(
    private readonly answerRepo: AnswerRepository,
    private readonly authRepository: AuthRepository,
  ) { }

  async findOne(id: string) {
    const answer = await this.answerRepo.findOnePublished(id); // repo로 빼는 게 깔끔
    if (!answer) throw new NotFoundException('답변을 찾을 수 없습니다.');
    return answer;
  }
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
      questionId: created.questionId.toString(),
      contents: created.contents,
      isAccepted: created.isAccepted,
      upCount: created.upCount,
      downCount: created.downCount,
      state: created.state,
      createdAt: created.createdAt.toISOString(),
      updatedAt: created.updatedAt.toISOString(),
      member: {
        id: created.member.id,
        nickname: created.member.nickname,
        avatarUrl: created.member.avatarUrl,
        cohort: created.member.cohort,
      },
    };
  }

  async update(
    idstr: string,
    memberIdStr: string,
    dto: UpdateAnswerDto,
  ): Promise<AnswerResponseDto> {
    const id = BigInt(idstr);
    const memberId = BigInt(memberIdStr);

    const ownerId = await this.answerRepo.findOwnerIdByAnswerId(id);
    if (!ownerId) throw new NotFoundException('답변의 주인이 없소');

    if (ownerId !== memberId) {
      throw new ForbiddenException('수정권한이 없소');
    }

    // ✅ 수정
    const updated = await this.answerRepo.update(id, {
      contents: dto.contents,
    });

    return {
      id: updated.id.toString(),
      questionId: updated.questionId.toString(),
      contents: updated.contents,
      isAccepted: updated.isAccepted,
      upCount: updated.upCount,
      downCount: updated.downCount,
      state: updated.state,
      createdAt: updated.createdAt.toISOString(),
      updatedAt: updated.updatedAt.toISOString(),
      member: {
        id: updated.member.id,
        nickname: updated.member.nickname,
        avatarUrl: updated.member.avatarUrl,
        cohort: updated.member.cohort,
      },
    };
  }

  async delete(idstr: string, memberIdStr: string) {
    const id = BigInt(idstr);
    const memberId = BigInt(memberIdStr);

    const ownerId = await this.answerRepo.findOwnerIdByAnswerId(id);
    if (!ownerId) throw new NotFoundException('답변의 주인이 없소');

    // ADMIN 권한 확인  
    const member = await this.authRepository.findById(memberId);
    const canDelete = ownerId === memberId || member?.role === Role.ADMIN;

    if (!canDelete) {
      throw new ForbiddenException('삭제권한이 없소');
    }

    await this.answerRepo.update(id, { state: 'DELETED' });
    return { id: idstr };
  }
  async like(answerIdStr: string, memberIdStr: string) {
    const answerId = BigInt(answerIdStr);
    const memberId = BigInt(memberIdStr);

    await this.answerRepo.like(answerId, memberId);
    return answerId;
  }

  async dislike(answerIdStr: string, memberIdStr: string) {
    const answerId = BigInt(answerIdStr);
    const memberId = BigInt(memberIdStr);

    await this.answerRepo.dislike(answerId, memberId);
    return answerId;
  }
}
