import { readdirSync } from 'fs';
import { join } from 'path';
import { PrismaClient, Project } from '../../../src/generated/prisma/client';
import { parseMarkdownWithFrontmatter, readMarkdownFile } from '../common/utils';

interface ProjectData {
  id: bigint; // seed 고정 id를 쓰고 싶으면 유지 (create에서만 사용)
  title?: string;
  description?: string;
  memberId: bigint;
  repoUrl: string;
  thumbnailUrl?: string;
  startDate?: Date | null;
  endDate?: Date | null;
  teamNumber?: number | null;
  teamName?: string | null;
  cohort?: number | null;
  field?: string | null;
  demoUrl?: string | null;
  viewCount?: number;
  participants: Array<{
    githubId: string;
    avatarUrl?: string;
  }>;
  techStackIds: bigint[];
}

/**
 * GitHub repo name으로 안전한 slug 생성
 */
function toRepoSlug(input: unknown) {
  const raw = String(input ?? '').trim();
  const slug = raw
    .toLowerCase()
    .replace(/\s+/g, '-') // 공백 -> -
    .replace(/[^a-z0-9-_]/g, '') // 안전한 문자만
    .replace(/-+/g, '-') // --- -> -
    .replace(/^-|-$/g, ''); // 앞뒤 - 제거

  return slug;
}

/**
 * upsert 헬퍼 함수 (repoUrl 기준으로 안정적으로 upsert)
 */
async function upsertProject(prisma: PrismaClient, projectData: ProjectData, contents: string) {
  const { participants, techStackIds, ...project } = projectData;

  if (!project.title?.trim()) {
    throw new Error(`Project title is missing. repoUrl=${project.repoUrl}`);
  }
  if (!project.repoUrl?.trim()) {
    throw new Error(`Project repoUrl is missing. title=${project.title}`);
  }

  // 1) Project: repoUrl(unique)로 upsert
  const createdProject = await prisma.project.upsert({
    where: { repoUrl: project.repoUrl }, // ✅ unique 필드로 upsert
    update: {
      title: project.title,
      description: project.description,
      thumbnailUrl: project.thumbnailUrl,
      startDate: project.startDate,
      endDate: project.endDate,
      teamNumber: project.teamNumber,
      teamName: project.teamName,
      cohort: project.cohort,
      field: project.field,
      demoUrl: project.demoUrl,
      contents,
      viewCount: project.viewCount,
      member: { connect: { id: project.memberId } },
      // ⚠️ id는 update에서 절대 변경하지 않음
    },
    create: {
      // id 고정 seed를 원하면 create에서만 부여 (기존 row의 id는 유지)
      id: project.id,

      title: project.title,
      description: project.description,
      repoUrl: project.repoUrl,
      thumbnailUrl: project.thumbnailUrl,
      startDate: project.startDate,
      endDate: project.endDate,
      teamNumber: project.teamNumber,
      teamName: project.teamName,
      cohort: project.cohort,
      field: project.field,
      demoUrl: project.demoUrl,
      contents,
      viewCount: project.viewCount,
      member: { connect: { id: project.memberId } },
    } as any,
  });

  // 2) Participants: (projectId, githubId) 복합 유니크로 upsert
  for (const participant of participants) {
    if (!participant.githubId?.trim()) continue;

    await prisma.projectParticipant.upsert({
      where: {
        projectId_githubId: {
          projectId: createdProject.id,
          githubId: participant.githubId,
        },
      },
      update: {
        avatarUrl: participant.avatarUrl,
      },
      create: {
        projectId: createdProject.id,
        githubId: participant.githubId,
        avatarUrl: participant.avatarUrl,
      },
    });
  }

  // 3) TechStackSelector: (projectId, techStackId) 복합 유니크로 upsert
  for (const techStackId of techStackIds) {
    await prisma.projectTechStack.upsert({
      where: {
        projectId_techStackId: {
          projectId: createdProject.id,
          techStackId,
        },
      },
      update: {},
      create: {
        projectId: createdProject.id,
        techStackId,
      },
    });
  }

  return createdProject;
}

/**
 * Project 도메인 시드 데이터 생성
 */
export async function seedProjects(prisma: PrismaClient) {
  console.log('🚀 Seeding projects...');

  const createdProjects: Project[] = [];

  const webProjectsPath = join(__dirname, '..', '..', 'fixtures', 'projects', 'web');
  const markdownFiles = readdirSync(webProjectsPath).filter((file) => file.endsWith('.md'));

  for (let i = 0; i < markdownFiles.length; i++) {
    const filename = markdownFiles[i];
    const fullContent = readMarkdownFile(filename, 'projects/web');
    const { metadata, content } = parseMarkdownWithFrontmatter(fullContent);

    // title 필수
    const title = String(metadata.title ?? '').trim();
    if (!title) {
      throw new Error(`missing metadata.title in ${filename}`);
    }

    // participants 배열 파싱
    const participantsData: Array<{ githubId: string; avatarUrl?: string }> = [];
    if (Array.isArray(metadata.participants)) {
      for (const githubId of metadata.participants) {
        const id = String(githubId ?? '').trim();
        if (!id) continue;
        participantsData.push({
          githubId: id,
          avatarUrl: `https://avatars.githubusercontent.com/${id}?v=4`,
        });
      }
    }

    // 랜덤 기술 스택 3개 선택 (1n ~ 32n 범위)
    const techStackIds: bigint[] = [];
    const selectedIds = new Set<number>();
    while (selectedIds.size < 3) {
      const randomId = Math.floor(Math.random() * 32) + 1; // 1 ~ 32
      selectedIds.add(randomId);
    }
    selectedIds.forEach((id) => techStackIds.push(BigInt(id)));

    // repoUrl은 slug 기반으로 안전하게 생성
    const repoSlug = toRepoSlug(title);
    if (!repoSlug) {
      throw new Error(`repo slug is empty after slugify. title="${title}" file=${filename}`);
    }

    const projectData: ProjectData = {
      id: BigInt(i + 1), // create에서만 사용됨 (기존 row id는 유지)
      title,
      description: String(metadata.description ?? ''),
      memberId: 1n, // willy
      repoUrl: `https://github.com/boostcampwm2025/${repoSlug}`,
      thumbnailUrl: metadata.thumbnailUrl ? String(metadata.thumbnailUrl) : undefined,
      startDate: new Date('2025-12-08'),
      endDate: null,
      teamNumber: Number.parseInt(filename.split('.')[0], 10),
      teamName: metadata.teamName ? String(metadata.teamName) : `Team ${i + 1}`,
      cohort: 10,
      field: 'WEB',
      demoUrl: metadata.demoUrl ? String(metadata.demoUrl) : undefined,
      viewCount: Math.floor(Math.random() * 1000),
      participants: participantsData,
      techStackIds,
    };

    const createdProject = await upsertProject(prisma, projectData, content);
    createdProjects.push(createdProject);
    console.log(`  ✅ Upserted project: ${projectData.title}`);
  }

  console.log(`✅ Upserted ${createdProjects.length} projects`);
  return createdProjects;
}
