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
      githubUniqueId: '29221823',
      githubLogin: 'JangDongHo',
      nickname: 'willy',
      avatarUrl: 'https://avatars.githubusercontent.com/u/29221823?v=4',
      cohort: 10,
    },
  });
  console.log('✅ Created member:', willy);

  const jack = await prisma.member.upsert({
    where: { id: 2n },
    update: {},
    create: {
      githubUniqueId: '141974597',
      githubLogin: 'LimSR12',
      nickname: 'Jack',
      avatarUrl: 'https://avatars.githubusercontent.com/u/141974597?v=4',
      cohort: 10,
    },
  });
  console.log('✅ Created member:', jack);

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
      thumbnailUrl:
        'https://images.velog.io/images/dongho18/post/74f5f82d-1a30-4f46-869c-392b2dc78475/flexbox-example4.png',
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

  // Project 데이터 생성
  const project = await prisma.project.upsert({
    where: { id: 1n },
    update: {},
    create: {
      // 핵심 프로젝트 정보
      title: 'BoostUs 커뮤니티 플랫폼',
      repoUrl: 'https://github.com/boostcampwm2025/web01-BoostUs',
      description: '부스트캠프 참가자들을 위한 커뮤니티 서비스',
      thumbnailUrl: 'https://placehold.co/600x400',

      // 프로젝트 기간
      startDate: new Date('2025-01-01'),
      endDate: new Date('2025-06-30'),

      // 팀 정보
      teamNumber: 1,
      teamName: 'BoostUs',
      cohort: 10,
      field: 'Web',

      // 서비스 정보
      demoUrl: 'https://boostus.dev',
      contents: `
# BoostUs

부스트캠프 참가자들을 위한 아카이빙 & 커뮤니티 플랫폼입니다.

- 프로젝트 공유
- 회고 기록
- 기술 스택 관리
    `,

      // 작성자 연결
      member: {
        connect: {
          id: 1n,
        },
      },
    },
  });

  const project2 = await prisma.project.upsert({
    where: { id: 2n },
    update: {},
    create: {
      // 핵심 프로젝트 정보
      title: '9기의 프로젝트',
      repoUrl: 'https://github.com/dummy/dummy',
      description: '부스트캠프 참가자들을 위한 커뮤니티 서비스',
      thumbnailUrl: 'https://placehold.co/600x400',

      // 프로젝트 기간
      startDate: new Date('2025-01-01'),
      endDate: new Date('2025-06-30'),

      // 팀 정보
      teamNumber: 1,
      teamName: 'dummy',
      cohort: 9,
      field: 'Web',

      // 서비스 정보
      demoUrl: 'https://dummy.dev',
      contents: `
# dummy
    `,

      // 작성자 연결
      member: {
        connect: {
          id: 1n,
        },
      },
    },
  });

  console.log('✅ Created project:', project2);

  // projectParticipant 생성
  const projectParticipant = await prisma.projectParticipant.upsert({
    where: { id: 1n },
    update: {},
    create: {
      githubId: 'LimSR12',
      avatarUrl: 'https://avatars.githubusercontent.com/u/141974597?v=4',
      project: {
        connect: {
          id: 1n,
        },
      },
    },
  });
  console.log('✅ Created projectParticipant:', projectParticipant);

  // teckStacks 생성
  const teckStacks = await prisma.techStack.upsert({
    where: { id: 1n },
    update: {},
    create: {
      name: 'NestJS',
    },
  });
  const teckStacks2 = await prisma.techStack.upsert({
    where: { id: 2n },
    update: {},
    create: {
      name: 'React',
    },
  });
  console.log('✅ Created teckStacks:', teckStacks);

  // projectTechStacks 생성

  const projectTechStacks = await prisma.projectTechStack.upsert({
    where: { id: 1n },
    update: {},
    create: {
      project: {
        connect: {
          id: 1n,
        },
      },
      techStack: {
        connect: {
          id: 1n,
        },
      },
    },
  });

  const projectTechStacks2 = await prisma.projectTechStack.upsert({
    where: { id: 2n },
    update: {},
    create: {
      project: {
        connect: {
          id: 1n,
        },
      },
      techStack: {
        connect: {
          id: 2n,
        },
      },
    },
  });
  console.log('✅ Created projectTechStacks:', projectTechStacks);

  console.log('🎉 Seeding completed!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
