import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MemberRepository {
  constructor(private readonly prisma: PrismaService) { }

  /**
   * 프로필 조회용 멤버 정보 조회
   * - 멤버 기본 정보 + 프로젝트 목록 + 피드 URL
   * - 프로젝트는 project_participants에서 현재 사용자의 githubId와 일치하는 것만 조회
   */
  async findProfileById(memberId: string) {
    const id = BigInt(memberId);

    // 먼저 member의 githubId를 가져옴
    const member = await this.prisma.member.findUnique({
      where: { id },
      select: {
        githubId: true,
        avatarUrl: true,
        githubLogin: true,
        nickname: true,
        cohort: true,
        feed: {
          select: {
            feedUrl: true,
          },
        },
      },
    });

    if (!member) {
      return null;
    }

    // project_participants에서 현재 사용자의 githubId 또는 githubLogin과 일치하는 프로젝트 ID 찾기
    // project_participants의 githubId 필드에는 githubLogin 값이 저장될 수 있음
    const githubIdString = member.githubId.toString();
    const participantProjects = await this.prisma.projectParticipant.findMany({
      where: {
        OR: [
          { githubId: githubIdString }, // 숫자 githubId
          { githubId: member.githubLogin ?? '' }, // githubLogin (예: "JangDongHo")
        ],
      },
      select: {
        projectId: true,
      },
    });

    const projectIds = participantProjects.map((p) => p.projectId);

    // 해당 프로젝트들 조회 (가장 최신 프로젝트 하나만)
    const latestProject = await this.prisma.project.findFirst({
      where: {
        id: { in: projectIds },
      },
      select: {
        title: true,
        teamName: true,
        field: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    return {
      avatarUrl: member.avatarUrl,
      githubLogin: member.githubLogin,
      nickname: member.nickname,
      cohort: member.cohort,
      feed: member.feed,
      latestProject,
    };
  }
}
