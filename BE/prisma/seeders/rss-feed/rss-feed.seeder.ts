import { PrismaClient } from '../../../src/generated/prisma/client';

/**
 * RSS Feed 도메인 시드 데이터 생성
 */
export async function seedRssFeeds(prisma: PrismaClient) {
  console.log('📡 Seeding RSS feeds...');

  const rssFeed = await prisma.rssFeed.upsert({
    where: { id: 1n },
    update: {},
    create: {
      rssUrl: 'https://v2.velog.io/rss/@dongho18',
      member: {
        connect: {
          id: 1n,
        },
      },
    },
  });
  console.log('  ✅ Created rss feed:', rssFeed);

  return { rssFeed };
}
