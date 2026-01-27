import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { GithubLoginUpsertDto } from './dto/github-login-upsert.dto';
import { generateRandomNickname } from './util/random-nickname.util';

@Injectable()
export class AuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  async upsertByGithubProfile(data: GithubLoginUpsertDto) {
    const randomNickname = generateRandomNickname();

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

  async findById(id: string) {
    return this.prisma.member.findUnique({
      where: { id: BigInt(id) },
      select: {
        id: true,
        nickname: true,
        avatarUrl: true,
        cohort: true,
        githubLogin: true,
      },
    });
  }
}
