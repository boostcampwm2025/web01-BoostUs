import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { MemberProfileResponseDto } from './dto/member-profile-response.dto';
import { MemberRepository } from './member.repository';
import { MemberNotFoundException } from './exception/member.exception';

@Injectable()
export class MemberService {
  constructor(private readonly memberRepository: MemberRepository) {}

  /**
   * 현재 로그인한 사용자의 마이페이지 프로필 조회
   */
  async getProfile(memberId: string): Promise<MemberProfileResponseDto> {
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
      },
      latestProject: profile.latestProject,
      feed: profile.feed ? { feedUrl: profile.feed.feedUrl } : null,
    };

    return plainToInstance(MemberProfileResponseDto, response, {
      excludeExtraneousValues: true,
    });
  }
}
