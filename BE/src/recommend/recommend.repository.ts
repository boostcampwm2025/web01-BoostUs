import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RecommendRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getRecommend() {
    const recommend = await this.prisma.project.findMany({
      where: { thumbnailKey: { not: null } },
    });
    return recommend;
  }
}
