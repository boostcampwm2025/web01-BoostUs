import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { GithubLoginResponseDto } from './dto/github-login-response.dto';

@Injectable()
export class AuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  async upsertByGithubProfile(data: GithubLoginResponseDto) {
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
        nickname: '',
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
}
