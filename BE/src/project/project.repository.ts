import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from 'src/generated/prisma/client';
import { ProjectListQueryDto } from './dto/project-list-query.dto';

@Injectable()
export class ProjectRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: bigint) {
    return this.prisma.project.findUnique({
      where: { id },
    });
  }

  async findAll(where?: Prisma.ProjectWhereInput) {
    const [totalItems, projects] = await this.prisma.$transaction([
      this.prisma.project.count({ where }),
      this.prisma.project.findMany({
        where: {
          AND: [
            { state: 'PUBLISHED' }, // 핵심 로직: 기본 state 필터
            ...(where ? [where] : []),
          ],
        },
        orderBy: { id: 'desc' },
        select: {
          id: true,
          thumbnailUrl: true,
          title: true,
          description: true,
          cohort: true,
          createdAt: true,
          updatedAt: true,
          viewCount: true,
          techStacks: {
            select: {
              techStack: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      }),
    ]);
    return { totalItems, projects };
  }

  async deleteById(id: bigint) {
    return this.prisma.project.delete({
      where: { id },
    });
  }

  async exists(id: bigint) {
    const count = await this.prisma.project.count({
      where: { id },
    });
    return count > 0;
  }
}
