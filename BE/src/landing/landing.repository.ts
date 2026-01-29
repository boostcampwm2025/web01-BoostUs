import { PrismaService } from 'src/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { ContentState } from 'src/generated/prisma/enums';

@Injectable()
export class LandingRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getCnt() {
    const [memberCnt, storyCnt, projectCnt] = await this.prisma.$transaction([
      this.prisma.member.count(),
      this.prisma.story.count({
        where: { state: ContentState.PUBLISHED },
      }),
      this.prisma.project.count({
        where: { state: ContentState.PUBLISHED },
      }),
    ]);

    return { memberCnt, storyCnt, projectCnt };
  }
}
