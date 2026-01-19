import { PrismaClient } from '../../../src/generated/prisma/client';

/**
 * RSS Feed 도메인 시드 데이터 생성
 */
export async function seedFeeds(prisma: PrismaClient) {
  console.log('📡 Seeding feeds...');

  const feeds = await prisma.feed.upsert({
    where: { id: 1n },
    update: {},
    create: {
      feedUrl: 'https://v2.velog.io/rss/@dongho18',
      member: {
        connect: {
          id: 1n,
        },
      },
    },
  });
  console.log('  ✅ Created feeds:', feeds);

  return { feeds };
}
