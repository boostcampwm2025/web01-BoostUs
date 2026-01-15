import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { config } from 'dotenv';
import { PrismaClient } from '../src/generated/prisma/client';
import { seedMembers, seedRssFeeds, seedStories } from './seeders';

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

/**
 * Prisma Seeding 문서 : https://www.prisma.io/docs/orm/prisma-migrate/workflows/seeding
 */
async function main() {
  console.log('🌱 Seeding database...');

  // 도메인별로 시드 데이터 생성
  await seedMembers(prisma);
  await seedRssFeeds(prisma);
  await seedStories(prisma);

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
