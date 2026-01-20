import { PrismaClient, TechStack, TechStackCategory } from '../../../src/generated/prisma/client';

const techStacks: Partial<TechStack>[] = [
  // 프론트엔드
  { id: 1n, name: 'React', category: TechStackCategory.FRONTEND },
  { id: 2n, name: 'Vue', category: TechStackCategory.FRONTEND },
  { id: 3n, name: 'TypeScript', category: TechStackCategory.FRONTEND },
  { id: 4n, name: 'JavaScript', category: TechStackCategory.FRONTEND },
  { id: 5n, name: 'Next.js', category: TechStackCategory.FRONTEND },
  { id: 6n, name: 'Tailwind CSS', category: TechStackCategory.FRONTEND },
  { id: 7n, name: 'Vite', category: TechStackCategory.FRONTEND },
  { id: 8n, name: 'Zustand', category: TechStackCategory.FRONTEND },

  // 백엔드
  { id: 9n, name: 'Node.js', category: TechStackCategory.BACKEND },
  { id: 10n, name: 'NestJS', category: TechStackCategory.BACKEND },
  { id: 11n, name: 'Express', category: TechStackCategory.BACKEND },
  { id: 12n, name: 'Spring Boot', category: TechStackCategory.BACKEND },
  { id: 13n, name: 'Django', category: TechStackCategory.BACKEND },
  { id: 14n, name: 'FastAPI', category: TechStackCategory.BACKEND },
  { id: 15n, name: 'Socket.io', category: TechStackCategory.BACKEND },

  // 데이터베이스
  { id: 16n, name: 'MySQL', category: TechStackCategory.DATABASE },
  { id: 17n, name: 'PostgreSQL', category: TechStackCategory.DATABASE },
  { id: 18n, name: 'MongoDB', category: TechStackCategory.DATABASE },
  { id: 19n, name: 'Redis', category: TechStackCategory.DATABASE },
  { id: 20n, name: 'Prisma', category: TechStackCategory.DATABASE },

  // 인프라/배포
  { id: 21n, name: 'Docker', category: TechStackCategory.INFRA },
  { id: 22n, name: 'Kubernetes', category: TechStackCategory.INFRA },
  { id: 23n, name: 'AWS', category: TechStackCategory.INFRA },
  { id: 24n, name: 'GCP', category: TechStackCategory.INFRA },
  { id: 25n, name: 'Nginx', category: TechStackCategory.INFRA },
  { id: 26n, name: 'GitHub Actions', category: TechStackCategory.INFRA },

  // 모바일
  { id: 27n, name: 'React Native', category: TechStackCategory.MOBILE },
  { id: 28n, name: 'Swift', category: TechStackCategory.MOBILE },
  { id: 29n, name: 'Kotlin', category: TechStackCategory.MOBILE },

  // 기타
  { id: 30n, name: 'Git', category: TechStackCategory.ETC },
  { id: 31n, name: 'Jest', category: TechStackCategory.ETC },
  { id: 32n, name: 'Webpack', category: TechStackCategory.ETC },
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
