import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from 'src/generated/prisma/client';
import { CreateProjectDto } from './dto/create-project.dto';
import { BadRequestException } from '@nestjs/common';

@Injectable()
export class ProjectRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: bigint) {
    return this.prisma.project.findUnique({
      where: { id },
      include: {
        participants: {
          select: {
            githubId: true,
            avatarUrl: true,
          },
        },
      },
    });
  }

  async findAll(where?: Prisma.ProjectWhereInput) {
    const [totalItems, projects] = await this.prisma.$transaction([
      this.prisma.project.count({ where }),
      this.prisma.project.findMany({
        where: {
          AND: [{ state: 'PUBLISHED' }, ...(where ? [where] : [])],
        },
        orderBy: { id: 'desc' },
        include: {
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

  async create(memberId: bigint, dto: CreateProjectDto) {
    return this.prisma.$transaction(async (tx) => {
      // 1, project 생성
      const project = await tx.project.create({
        data: {
          memberId,
          thumbnailUrl: dto.thumbnailUrl ?? null,
          title: dto.title ?? null,
          description: dto.description ?? null,
          contents: dto.contents ?? null,
          repoUrl: dto.repoUrl,
          demoUrl: dto.demoUrl ?? null,
          cohort: dto.cohort ?? null,
          startDate: dto.startDate ? new Date(dto.startDate) : null,
          endDate: dto.endDate ? new Date(dto.endDate) : null,
          field: dto.field ?? null,
        },
        select: { id: true },
      });

      // 2. project_participants 생성
      if (dto.participants?.length) {
        // 중복 제거
        const uniq = new Map<string, { githubId: string; avatarUrl?: string }>();
        for (const participant of dto.participants) {
          uniq.set(participant.githubId, participant);
        }

        await tx.projectParticipant.createMany({
          data: [...uniq.values()].map((p) => ({
            projectId: project.id,
            githubId: p.githubId,
            avatarUrl: p.avatarUrl,
          })),
        });
      }

      // 3. project_tech_stacks 생성
      const techStackIds = [...new Set(dto.techStack ?? [])];

      if (techStackIds.length) {
        const ids = techStackIds.map((id) => BigInt(id));
        const foundCount = await tx.techStack.count({
          where: { id: { in: ids } },
        });
        if (foundCount !== ids.length) {
          throw new BadRequestException();
        }

        await tx.projectTechStack.createMany({
          data: techStackIds.map((id) => ({
            projectId: project.id,
            techStackId: BigInt(id),
          })),
          skipDuplicates: true, // (projectId, techStackId) unique 제약조건 충돌 방어
        });
      }

      return project;
    });
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
