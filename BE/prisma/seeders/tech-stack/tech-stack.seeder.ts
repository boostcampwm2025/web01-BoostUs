import { PrismaClient, TechStack } from '../../../src/generated/prisma/client';

const techStacks: Partial<TechStack>[] = [
  // 프론트엔드
  { id: 1n, name: 'React' },
  { id: 2n, name: 'Vue' },
  { id: 3n, name: 'TypeScript' },
  { id: 4n, name: 'JavaScript' },
  { id: 5n, name: 'Next.js' },
  { id: 6n, name: 'Tailwind CSS' },
  { id: 7n, name: 'Vite' },
  { id: 8n, name: 'Zustand' },

  // 백엔드
  { id: 9n, name: 'Node.js' },
  { id: 10n, name: 'NestJS' },
  { id: 11n, name: 'Express' },
  { id: 12n, name: 'Spring Boot' },
  { id: 13n, name: 'Django' },
  { id: 14n, name: 'FastAPI' },
  { id: 15n, name: 'Socket.io' },

  // 데이터베이스
  { id: 16n, name: 'MySQL' },
  { id: 17n, name: 'PostgreSQL' },
  { id: 18n, name: 'MongoDB' },
  { id: 19n, name: 'Redis' },
  { id: 20n, name: 'Prisma' },

  // 인프라/배포
  { id: 21n, name: 'Docker' },
  { id: 22n, name: 'Kubernetes' },
  { id: 23n, name: 'AWS' },
  { id: 24n, name: 'GCP' },
  { id: 25n, name: 'Nginx' },
  { id: 26n, name: 'GitHub Actions' },

  // 모바일
  { id: 27n, name: 'React Native' },
  { id: 28n, name: 'Swift' },
  { id: 29n, name: 'Kotlin' },

  // 기타
  { id: 30n, name: 'Git' },
  { id: 31n, name: 'Jest' },
  { id: 32n, name: 'Webpack' },
];

/**
 * TechStack 도메인 시드 데이터 생성
 */
export async function seedTechStacks(prisma: PrismaClient) {
  console.log('🔧 Seeding tech stacks...');

  const createdTechStacks: TechStack[] = [];

  for (const techStack of techStacks) {
    const created = await prisma.techStack.upsert({
      where: { id: techStack.id },
      update: {},
      create: techStack as TechStack,
    });
    createdTechStacks.push(created);
    console.log(`  ✅ Created tech stack: ${techStack.name}`);
  }

  console.log(`✅ Created ${createdTechStacks.length} tech stacks`);
  return createdTechStacks;
}
