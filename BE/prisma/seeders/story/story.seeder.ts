import { PrismaClient } from '../../../src/generated/prisma/client';
import { readMarkdownFile } from '../common/utils';

/**
 * Story 도메인 시드 데이터 생성
 */
export async function seedStories(prisma: PrismaClient) {
  console.log('📖 Seeding stories...');

  // Story 1
  const story1Contents = readMarkdownFile('story-1.md');
  const story1 = await prisma.story.upsert({
    where: { id: 1n },
    update: {},
    create: {
      title: '[트러블슈팅] Supabase Max client connections reached',
      summary:
        '오늘은 일주일 간 나를 골머리 아프게 했던 Max client connections reached 에러 해결 방법에 대해 기록하고자 한다. 이 문제를 해결하면서 데이터베이스의 연결 관리와 최적화에 대해 많은 것을 배울 수 있었다.',
      contents: story1Contents,
      thumbnailUrl:
        'https://velog.velcdn.com/images/dongho18/post/68a56b44-9e91-4413-a263-f196ff8b7895/image.png',
      originalUrl:
        'https://velog.io/@dongho18/%ED%8A%B8%EB%9F%AC%EB%B8%94%EC%8A%88%ED%8C%85-Supabase-Max-client-connections-reached',
      member: {
        connect: {
          id: 1n,
        },
      },
      rssFeed: {
        connect: {
          id: 1n,
        },
      },
    },
  });
  console.log('  ✅ Created story 1:', story1);

  // Story 2
  const story2Contents = readMarkdownFile('story-2.md');
  const story2 = await prisma.story.upsert({
    where: { id: 2n },
    update: {},
    create: {
      title: '이커머스 도메인 개체명 인식기 개발하기',
      summary: '이커머스 도메인 개체명 인식기를 개발해서 상품의 추천 성능을 높여보자.',
      contents: story2Contents,
      thumbnailUrl:
        'https://velog.velcdn.com/images/dongho18/post/03c5a144-25fa-4403-bae7-851a8ddfd34d/image.png',
      originalUrl:
        'https://velog.io/@dongho18/%EC%9D%B4%EC%BB%A4%EB%A8%B8%EC%8A%A4-%EB%8F%84%EB%A9%94%EC%9D%B8-%EA%B0%9C%EC%B2%B4%EB%AA%85-%EC%9D%B8%EC%8B%9D%EA%B8%B0-%EA%B0%9C%EB%B0%9C%ED%95%98%EA%B8%B0',
      member: {
        connect: {
          id: 1n,
        },
      },
      rssFeed: {
        connect: {
          id: 1n,
        },
      },
    },
  });
  console.log('  ✅ Created story 2:', story2);

  return { story1, story2 };
}
