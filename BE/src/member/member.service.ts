import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Prisma } from '../generated/prisma/client';

import { MemberProfileResponseDto } from './dto/member-profile-response.dto';
import { MemberRepository } from './member.repository';
import {
  MemberNotFoundException,
  MemberNicknameDuplicateException,
} from './exception/member.exception';
import { UpdateNicknameDto } from './dto/member-profile-update-nickname.dto';

@Injectable()
export class MemberService {
  constructor(private readonly memberRepository: MemberRepository) {}

  /**
   * 현재 로그인한 사용자의 마이페이지 프로필 조회
   */
  async getProfile(memberId: bigint): Promise<MemberProfileResponseDto> {
    const profile = await this.memberRepository.findProfileById(memberId);

    if (!profile) {
      throw new MemberNotFoundException(memberId);
    }

    const response = {
      member: {
        id: profile.id,
        avatarUrl: profile.avatarUrl,
        githubLogin: profile.githubLogin,
        nickname: profile.nickname,
        cohort: profile.cohort,
        role: profile.role,
      },
      latestProject: profile.latestProject,
      feed: profile.feed ? { feedUrl: profile.feed.feedUrl } : null,
    };

    return plainToInstance(MemberProfileResponseDto, response, {
      excludeExtraneousValues: true,
    });
  }

  async updateMyNickname(
    memberId: bigint,
    dto: UpdateNicknameDto,
  ): Promise<MemberProfileResponseDto> {
    // 기존 프로필 정보 조회 (프로젝트, 피드 정보 유지용)
    const profile = await this.memberRepository.findProfileById(memberId);
    if (!profile) {
      throw new MemberNotFoundException(memberId);
    }

    try {
      // 2. 닉네임 업데이트 시도
      const updated = await this.memberRepository.updateNickname(memberId, dto.nickname);

      // 3. 응답 데이터 조합 (업데이트된 멤버 정보 + 기존 프로젝트/피드 정보)
      const response = {
        member: {
          id: updated.id,
          avatarUrl: updated.avatarUrl,
          githubLogin: updated.githubLogin,
          nickname: updated.nickname,
          cohort: updated.cohort,
          role: profile.role,
        },
        latestProject: profile.latestProject, // 기존 정보 재사용
        feed: profile.feed ? { feedUrl: profile.feed.feedUrl } : null, // 기존 정보 재사용
      };

      return plainToInstance(MemberProfileResponseDto, response, {
        excludeExtraneousValues: true,
      });
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2002' // Unique constraint failed
      ) {
        throw new MemberNicknameDuplicateException(dto.nickname);
      }
      throw e;
    }
  }
}
