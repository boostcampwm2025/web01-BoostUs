import { readdirSync } from 'fs';
import { join } from 'path';
import { PrismaClient, Project } from '../../../src/generated/prisma/client';
import { parseMarkdownWithFrontmatter, readMarkdownFile } from '../common/utils';

interface ProjectData {
  id: bigint;
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
 * upsert 헬퍼 함수
 */
async function upsertProject(prisma: PrismaClient, projectData: ProjectData, contents: string) {
  const { participants, techStackIds, ...project } = projectData;

  // 1. 프로젝트 생성 또는 업데이트
  const createdProject = await prisma.project.upsert({
    where: { id: project.id },
    update: {},
    create: {
      id: project.id,
      title: project.title,
      description: project.description,
      repoUrl: project.repoUrl!,
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
      member: {
        connect: { id: project.memberId },
      },
    } as any,
  });

  // 2. 참여자 추가
  for (const participant of participants) {
    await prisma.projectParticipant.upsert({
      where: {
        projectId_githubId: {
          projectId: createdProject.id,
          githubId: participant.githubId,
        },
      },
      update: {},
      create: {
        projectId: createdProject.id,
        githubId: participant.githubId,
        avatarUrl: participant.avatarUrl,
      },
    });
  }

  // 3. 기술 스택 연결
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

  // web 폴더에서 모든 마크다운 파일 읽기
  const webProjectsPath = join(__dirname, '..', '..', 'fixtures', 'projects', 'web');
  const markdownFiles = readdirSync(webProjectsPath).filter((file) => file.endsWith('.md'));

  for (let i = 0; i < markdownFiles.length; i++) {
    const filename = markdownFiles[i];
    const fullContent = readMarkdownFile(filename, 'projects/web');
    const { metadata, content } = parseMarkdownWithFrontmatter(fullContent);

    // participants 배열 파싱
    const participantsData: Array<{ githubId: string; avatarUrl?: string }> = [];
    if (Array.isArray(metadata.participants)) {
      for (const githubId of metadata.participants) {
        participantsData.push({
          githubId,
          avatarUrl: `https://avatars.githubusercontent.com/${githubId}?v=4`,
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

    // 메타데이터에서 프로젝트 정보 추출
    const projectData: ProjectData = {
      id: BigInt(i + 1),
      title: metadata.title || '',
      description: metadata.description || '',
      memberId: 1n, // willy
      repoUrl: `https://github.com/boostcampwm2025/${metadata.title}`,
      thumbnailUrl: metadata.thumbnailUrl,
      startDate: new Date('2025-12-08'),
      endDate: null,
      teamNumber: parseInt(filename.split('.')[0], 10),
      teamName: metadata.teamName || `Team ${i + 1}`,
      cohort: 10,
      field: 'WEB',
      demoUrl: metadata.demoUrl,
      viewCount: Math.floor(Math.random() * 1000), // 0 ~ 999 사이의 랜덤 정수
      participants: participantsData,
      techStackIds,
    };

    const createdProject = await upsertProject(prisma, projectData, content);
    createdProjects.push(createdProject);
    console.log(`  ✅ Created project: ${projectData.title}`);
  }

  console.log(`✅ Created ${createdProjects.length} projects`);
  return createdProjects;
}
