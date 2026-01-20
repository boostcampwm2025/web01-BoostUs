import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from 'src/generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';

@Injectable()
export class ProjectRepository {
  constructor(private readonly prisma: PrismaService) { }

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
        const uniqueGithubIds = [...new Set(dto.participants)];

        await tx.projectParticipant.createMany({
          data: uniqueGithubIds.map((githubId) => ({
            projectId: project.id,
            githubId,
            avatarUrl: null,
          })),
        });
      }

      // 3. project_tech_stacks 생성
      const techStackNames = [...new Set(dto.techStack ?? [])];

      if (techStackNames.length) {
        // 기술 스택 이름으로 ID 조회
        const foundTechStacks = await tx.techStack.findMany({
          where: { name: { in: techStackNames } },
          select: { id: true, name: true },
        });

        // 존재하지 않는 기술 스택 검증
        if (foundTechStacks.length !== techStackNames.length) {
          const foundNames = foundTechStacks.map((ts) => ts.name);
          const notFoundNames = techStackNames.filter((name) => !foundNames.includes(name));
          throw new BadRequestException(
            `존재하지 않는 기술 스택: ${notFoundNames.join(', ')}`,
          );
        }

        await tx.projectTechStack.createMany({
          data: foundTechStacks.map((ts) => ({
            projectId: project.id,
            techStackId: ts.id,
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
