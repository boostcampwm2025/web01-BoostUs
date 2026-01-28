import { BadRequestException, Injectable } from '@nestjs/common';
import { ContentState, Prisma } from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

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
    });
  }

  async findAll(where?: Prisma.ProjectWhereInput) {
    const [totalItems, projects] = await this.prisma.$transaction([
      this.prisma.project.count({ where }),
      this.prisma.project.findMany({
        where: {
          AND: [{ state: 'PUBLISHED' }, ...(where ? [where] : [])],
        },
        orderBy: { teamNumber: 'asc' },
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

  async create(memberId: bigint, dto: CreateProjectDto, thumbnailKey: string | undefined) {
    return this.prisma.$transaction(async (tx) => {
      // 1, project 생성
      const project = await tx.project.create({
        data: {
          memberId,
          thumbnailKey: thumbnailKey ?? null,
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

      // 2. 프로젝트 등록자 정보 조회
      const registerMember = await tx.member.findUnique({
        where: { id: memberId },
        select: { githubLogin: true },
      });

      if (!registerMember) {
        throw new BadRequestException('프로젝트 소유자 정보를 찾을 수 없습니다.');
      }

      // 3. project_participants 생성 (등록자 정보 포함)
      const participantGithubIds = dto.participants?.length
        ? [...new Set([registerMember.githubLogin, ...dto.participants])]
        : [registerMember.githubLogin];

      await tx.projectParticipant.createMany({
        data: participantGithubIds
          .filter((githubId): githubId is string => githubId !== null && githubId !== undefined)
          .map((githubId) => ({
            projectId: project.id,
            githubId,
            avatarUrl: null,
          })),
      });

      // 4. project_tech_stacks 생성
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
          throw new BadRequestException(`존재하지 않는 기술 스택: ${notFoundNames.join(', ')}`);
        }

        await tx.projectTechStack.createMany({
          data: foundTechStacks.map((ts) => ({
            projectId: project.id,
            techStackId: ts.id,
          })),
          skipDuplicates: true, // (projectId, techStackId) unique 제약조건 충돌 방어
        });
      }

      return tx.project.findUniqueOrThrow({
        where: { id: project.id },
        include: {
          participants: true,
          techStacks: {
            include: {
              techStack: { select: { name: true } },
            },
          },
        },
      });
    });
  }

  async canMemberUpdateProject(projectId: bigint, memberGithubLogin: string): Promise<boolean> {
    const participants = await this.prisma.projectParticipant.findMany({
      where: { projectId },
      select: { githubId: true },
    });

    return participants.some((p) => p.githubId === memberGithubLogin);
  }

  async update(id: bigint, dto: UpdateProjectDto, thumbnailKey: string | undefined) {
    return this.prisma.$transaction(async (tx) => {
      // 1. participants 업데이트 (전체 교체)
      if (dto.participants !== undefined) {
        await tx.projectParticipant.deleteMany({ where: { projectId: id } });

        const participants = Array.isArray(dto.participants) ? dto.participants : [];
        if (participants.length > 0) {
          const uniqueGithubIds = [...new Set(participants)];
          await tx.projectParticipant.createMany({
            data: uniqueGithubIds.map((githubId) => ({
              projectId: id,
              githubId,
              avatarUrl: null,
            })),
          });
        }
      }

      // 2. techStacks 업데이트 (전체 교체)
      if (dto.techStack !== undefined) {
        await tx.projectTechStack.deleteMany({ where: { projectId: id } });

        if (dto.techStack.length > 0) {
          const techStack = Array.isArray(dto.techStack) ? dto.techStack : [];
          const techStackNames = [...new Set(techStack)];

          // 기술 스택 이름으로 ID 조회
          const foundTechStacks = await tx.techStack.findMany({
            where: { name: { in: techStackNames } },
            select: { id: true, name: true },
          });

          // 존재하지 않는 기술 스택 검증
          if (foundTechStacks.length !== techStackNames.length) {
            const foundNames = foundTechStacks.map((ts) => ts.name);
            const notFoundNames = techStackNames.filter((name) => !foundNames.includes(name));
            throw new BadRequestException(`존재하지 않는 기술 스택: ${notFoundNames.join(', ')}`);
          }

          await tx.projectTechStack.createMany({
            data: foundTechStacks.map((ts) => ({
              projectId: id,
              techStackId: ts.id,
            })),
            skipDuplicates: true,
          });
        }
      }

      // 3. 프로젝트 정보 업데이트
      const updateData: Prisma.ProjectUpdateInput = {};

      if (thumbnailKey !== undefined) updateData.thumbnailKey = thumbnailKey ?? null;
      if (dto.title !== undefined) updateData.title = dto.title;
      if (dto.description !== undefined) updateData.description = dto.description ?? null;
      if (dto.contents !== undefined) updateData.contents = dto.contents ?? null;
      if (dto.repoUrl !== undefined) updateData.repoUrl = dto.repoUrl;
      if (dto.demoUrl !== undefined) updateData.demoUrl = dto.demoUrl ?? null;
      if (dto.cohort !== undefined) updateData.cohort = dto.cohort ?? null;
      if (dto.startDate !== undefined)
        updateData.startDate = dto.startDate ? new Date(dto.startDate) : null;
      if (dto.endDate !== undefined)
        updateData.endDate = dto.endDate ? new Date(dto.endDate) : null;
      if (dto.field !== undefined) updateData.field = dto.field ?? null;

      // 업데이트할 정보가 없으면 기존 프로젝트 반환
      if (Object.keys(updateData).length === 0) {
        return tx.project.findUnique({ where: { id } });
      }

      return tx.project.update({
        where: { id },
        data: updateData,
      });
    });
  }

  async deleteById(id: bigint) {
    return this.prisma.project.update({
      where: { id },
      data: { state: ContentState.DELETED },
    });
  }

  async exists(id: bigint) {
    const count = await this.prisma.project.count({
      where: { id },
    });
    return count > 0;
  }
}
