import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { GithubLoginUpsertDto } from './dto/github-login-upsert.dto';
import { NICKNAME_ADJECTIVES, NICKNAME_NOUNS } from './type/nickname.type';

@Injectable()
export class AuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  async upsertByGithubProfile(data: GithubLoginUpsertDto) {
    const randomNickname = this._generateRandomNickname();

    return this.prisma.member.upsert({
      where: { githubId: data.githubId },
      update: {
        githubLogin: data.githubLogin,
        avatarUrl: data.avatarUrl,
        cohort: data.cohort,
      },
      create: {
        githubId: data.githubId,
        githubLogin: data.githubLogin,
        nickname: randomNickname,
        avatarUrl: data.avatarUrl,
        cohort: data.cohort,
      },
      select: {
        id: true,
        githubId: true,
        githubLogin: true,
        nickname: true,
        avatarUrl: true,
        cohort: true,
        state: true,
      },
    });
  }

  private _generateRandomNickname(): string {
    const adj = NICKNAME_ADJECTIVES[Math.floor(Math.random() * NICKNAME_ADJECTIVES.length)];
    const noun = NICKNAME_NOUNS[Math.floor(Math.random() * NICKNAME_NOUNS.length)];
    const suffix = Math.floor(1000 + Math.random() * 9000);

    return `${adj}${noun}${suffix}`;
  }
}
