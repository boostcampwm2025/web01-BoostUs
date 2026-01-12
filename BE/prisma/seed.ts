import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { config } from 'dotenv';
import { PrismaClient } from '../src/generated/prisma/client';

// 환경변수 로드
config();

// MariaDB adapter 설정
const adapter = new PrismaMariaDb({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectionLimit: 5,
});

const prisma = new PrismaClient({ adapter });

//**
// Prisma Seeding 문서 : https://www.prisma.io/docs/orm/prisma-migrate/workflows/seeding
//  */
async function main() {
  console.log('🌱 Seeding database...');

  // Member 데이터 생성
  const willy = await prisma.member.upsert({
    where: { id: 1n },
    update: {},
    create: {
      nickname: 'willy',
      avatarUrl: 'https://avatars.githubusercontent.com/u/29221823?v=4',
      cohort: 10,
    },
  });
  console.log('✅ Created member:', willy);

  // RSS Feed 데이터 생성
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
  console.log('✅ Created rss feed:', rssFeed);

  // Story 데이터 생성
  const story = await prisma.story.upsert({
    where: { id: 1n },
    update: {},
    create: {
      title: 'NestJS로 블로그 만들기',
      summary: 'NestJS를 사용해 블로그 API를 설계해봅니다.',
      contents: 'test',
      thumbnailUrl: 'https://images.velog.io/images/dongho18/post/74f5f82d-1a30-4f46-869c-392b2dc78475/flexbox-example4.png',
      originalUrl: 'https://dongho18.velog.io/post/nestjs-blog',
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
  console.log('✅ Created story:', story);
  
  console.log('🎉 Seeding completed!');
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
