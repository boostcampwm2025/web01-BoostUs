import { PrismaClient } from '../../../src/generated/prisma/client';

/**
 * Member 도메인 시드 데이터 생성
 */
export async function seedMembers(prisma: PrismaClient) {
  console.log('👤 Seeding members...');

  const willy = await prisma.member.upsert({
    where: { id: 1n },
    update: {},
    create: {
      githubId: parseInt('29221823', 10),
      githubLogin: 'JangDongHo',
      nickname: 'willy',
      avatarUrl: 'https://avatars.githubusercontent.com/u/29221823?v=4',
      cohort: 10,
    },
  });
  console.log('  ✅ Created member:', willy);

  return { willy };
}
