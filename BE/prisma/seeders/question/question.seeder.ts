import { PrismaClient } from '../../../src/generated/prisma/client';

type SeedMembersResult = {
  willy: { id: bigint };
};

function daysAgo(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}

function toHashtags(tags: string[]) {
  // schema: comma-separated string
  return tags.join(',');
}

/**
 * Question 도메인 시드 데이터 생성 (20개)
 * - 최신순 테스트: createdAt 분산
 * - 인기순 테스트: upCount 분포(상/중/하)
 * - 중복 방지: id 기반 upsert (1n~20n)
 */
export async function seedQuestions(prisma: PrismaClient, members: SeedMembersResult) {
  console.log('❓ Seeding questions...');

  const templates = [
    {
      title: 'NestJS에서 모듈 분리는 어떻게 하나요?',
      contents: 'NestJS 프로젝트에서 모듈을 어떤 기준으로 나누면 유지보수에 좋을까요?',
      hashtags: ['NestJS', 'Backend', 'Architecture'],
    },
    {
      title: 'Prisma cursor pagination 구현 팁이 있을까요?',
      contents: 'createdAt DESC 기준 cursor pagination에서 중복/누락을 줄이는 패턴이 궁금합니다.',
      hashtags: ['Prisma', 'Pagination', 'Backend'],
    },
    {
      title: 'MySQL 인덱스 설계할 때 우선순위는?',
      contents: '조회 쿼리 기준으로 인덱스를 잡고 싶은데, 복합 인덱스 순서가 헷갈립니다.',
      hashtags: ['MySQL', 'Index', 'Database'],
    },
    {
      title: 'Docker Compose dev/prod 파일 분리 전략',
      contents: 'dev/prod 환경 차이를 compose 파일로 어떻게 분리하는 게 실무적으로 좋을까요?',
      hashtags: ['Docker', 'DevOps'],
    },
    {
      title: 'GitHub Actions에서 캐시(cache) 제대로 쓰는 법',
      contents: 'npm/pnpm cache 설정 시 cache-dependency-path와 키 전략을 어떻게 잡는 게 좋나요?',
      hashtags: ['GitHubActions', 'CI', 'DevOps'],
    },
    {
      title: 'NestJS에서 Transaction 처리 어디서 하는 게 좋나요?',
      contents: 'Service 계층에서 트랜잭션을 걸어야 할지, Repository에서 걸어야 할지 고민입니다.',
      hashtags: ['NestJS', 'Database', 'Transaction'],
    },
    {
      title: 'Prisma generate는 언제 필요한가요?',
      contents: 'CI에서 prisma generate를 넣는 이유와 로컬 개발에서 실행 타이밍이 궁금합니다.',
      hashtags: ['Prisma', 'TypeScript'],
    },
    {
      title: 'API 응답 DTO / Entity 변환 패턴 추천',
      contents: 'NestJS에서 DTO와 Entity 변환을 어디서 책임지게 하는 게 좋을까요?',
      hashtags: ['NestJS', 'DTO', 'Architecture'],
    },
    {
      title: '커서 기반에서 인기순 정렬 안정성 확보 방법',
      contents: 'upCount가 계속 변하는데 cursor pagination에서 안정성을 어떻게 가져가나요?',
      hashtags: ['Pagination', 'Database', 'Backend'],
    },
    {
      title: 'MySQL에서 BigInt를 TS에서 어떻게 다루나요?',
      contents: 'Prisma BigInt 필드를 JSON으로 내려줄 때 직렬화 이슈가 있습니다.',
      hashtags: ['MySQL', 'Prisma', 'TypeScript'],
    },
    // 10개 더
    {
      title: 'NestJS Guard vs Interceptor 사용 기준',
      contents: '인증/인가, 로깅, 응답 변환을 각각 어디서 처리하는 게 좋은지 궁금합니다.',
      hashtags: ['NestJS', 'Security'],
    },
    {
      title: '조회수(viewCount) 증가를 트랜잭션으로 해야 하나요?',
      contents:
        '단순 조회수 증가를 매 요청마다 update 하는 게 맞는지, 배치로 해야 하는지 고민입니다.',
      hashtags: ['Database', 'Performance'],
    },
    {
      title: '해시태그를 String 콤마로 저장 vs 정규화',
      contents: 'hashtags를 string으로 저장 중인데, 검색/필터가 늘면 정규화가 필요할까요?',
      hashtags: ['Database', 'Modeling'],
    },
    {
      title: 'Prisma에서 where 조건 동적 조립 팁',
      contents: '검색 조건이 많아지면 where를 깔끔하게 조립하는 방법이 있을까요?',
      hashtags: ['Prisma', 'TypeScript'],
    },
    {
      title: 'NestJS에서 예외 처리(필터) 베스트 프랙티스',
      contents: '전역 ExceptionFilter와 도메인별 예외를 어떻게 나누는 게 좋을까요?',
      hashtags: ['NestJS', 'Backend'],
    },
    {
      title: 'CI에서 MySQL 붙여서 테스트 vs In-memory',
      contents: '통합 테스트에서 DB를 docker로 올릴지, sqlite로 갈지 장단점이 궁금합니다.',
      hashtags: ['Testing', 'CI', 'Database'],
    },
    {
      title: 'Nginx 리버스 프록시로 /api 라우팅하기',
      contents: 'Next에서 /api 요청을 BE로 넘기는 리버스 프록시 설정을 고민 중입니다.',
      hashtags: ['Nginx', 'NextJS', 'DevOps'],
    },
    {
      title: '타입 안전한 API 응답 스키마 설계',
      contents: 'success/message/error/data 형태를 유지하면서도 타입 안정성을 높이고 싶습니다.',
      hashtags: ['TypeScript', 'API'],
    },
    {
      title: '답변 채택(isAccepted/isResolved) 플로우 설계',
      contents: 'Answer.isAccepted와 Question.isResolved를 어떻게 동기화하는 게 좋을까요?',
      hashtags: ['Backend', 'Design'],
    },
    {
      title: '대용량 리스트에서 offset pagination이 느린 이유',
      contents: 'offset 기반 pagination이 왜 느려지고, cursor 방식이 왜 좋은지 설명이 필요합니다.',
      hashtags: ['Database', 'Pagination', 'Performance'],
    },
  ];

  // 인기 분포: 상(3), 중(5), 하(12)
  const upCounts = [
    45,
    38,
    32, // top 3
    28,
    22,
    18,
    15,
    11, // mid 5
    9,
    8,
    7,
    6,
    5,
    4,
    3,
    3,
    2,
    2,
    1,
    0, // low 12 (20개 맞추기)
  ];

  const createdAts = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 18, 21, 25, 30].map(
    daysAgo,
  );

  const results = [];

  for (let i = 0; i < 20; i++) {
    const id = BigInt(i + 1); // 1n ~ 20n
    const t = templates[i % templates.length];

    const q = await prisma.question.upsert({
      where: { id },
      update: {
        title: t.title,
        contents: t.contents,
        hashtags: toHashtags(t.hashtags),
        // 값이 바뀌더라도 시드 재실행시 동일하게 맞추고 싶으면 update에도 넣어주는 게 좋음
        viewCount: 50 + i * 13,
        upCount: upCounts[i],
        downCount: Math.floor(upCounts[i] / 10),
        isResolved: i % 4 === 0, // 0,4,8,12,16 resolved
        state: 'PUBLISHED',
        createdAt: createdAts[i],
      },
      create: {
        id,
        memberId: members.willy.id,
        title: t.title,
        contents: t.contents,
        hashtags: toHashtags(t.hashtags),
        viewCount: 50 + i * 13,
        upCount: upCounts[i],
        downCount: Math.floor(upCounts[i] / 10),
        isResolved: i % 4 === 0,
        state: 'PUBLISHED',
        createdAt: createdAts[i],
      },
    });

    results.push(q);
  }

  console.log(`  ✅ Upserted questions: ${results.length}`);
  return { questions: results };
}
