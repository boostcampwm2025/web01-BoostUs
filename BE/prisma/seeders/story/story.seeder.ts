import { PrismaClient, Story } from '../../../src/generated/prisma/client';
import { readMarkdownFile } from '../common/utils';

// createdAt: 랜덤 (1 ~ 30일 전), 한국 시간(KST) 기준으로 설정
function getRandomKSTDateWithin30Days() {
  // Get current UTC time in ms, then add 9 hours to convert to KST
  const now = new Date();
  // 9시간 = 9 * 60 * 60 * 1000 = 32400000
  const kstNow = new Date(now.getTime() + 9 * 60 * 60 * 1000);

  // 1 ~ 30 사이의 정수
  const daysAgo = Math.floor(Math.random() * 30) + 1;

  // kstNow에서 daysAgo만큼 이전으로 이동
  const randomKST = new Date(kstNow.getTime() - daysAgo * 24 * 60 * 60 * 1000);

  return randomKST;
}

const stories: Partial<Story>[] = [
  {
    id: 1n,
    title: '[트러블슈팅] Supabase Max client connections reached',
    summary:
      '오늘은 일주일 간 나를 골머리 아프게 했던 Max client connections reached 에러 해결 방법에 대해 기록하고자 한다. 이 문제를 해결하면서 데이터베이스의 연결 관리와 최적화에 대해 많은 것을 배울 수 있었다.',
    thumbnailUrl:
      'https://velog.velcdn.com/images/dongho18/post/68a56b44-9e91-4413-a263-f196ff8b7895/image.png',
    originalUrl:
      'https://velog.io/@dongho18/%ED%8A%B8%EB%9F%AC%EB%B8%94%EC%8A%88%ED%8C%85-Supabase-Max-client-connections-reached',
    likeCount: 55,
    viewCount: 123,
    createdAt: getRandomKSTDateWithin30Days(),
  },
  {
    id: 2n,
    title: '이커머스 도메인 개체명 인식기 개발하기',
    summary: '이커머스 도메인 개체명 인식기를 개발해서 상품의 추천 성능을 높여보자.',
    thumbnailUrl:
      'https://velog.velcdn.com/images/dongho18/post/03c5a144-25fa-4403-bae7-851a8ddfd34d/image.png',
    originalUrl:
      'https://velog.io/@dongho18/%EC%9D%B4%EC%BB%A4%EB%A8%B8%EC%8A%A4-%EB%8F%84%EB%A9%94%EC%9D%B8-%EA%B0%9C%EC%B2%B4%EB%AA%85-%EC%9D%B8%EC%8B%9D%EA%B8%B0-%EA%B0%9C%EB%B0%9C%ED%95%98%EA%B8%B0',
    likeCount: 12,
    viewCount: 34,
    createdAt: getRandomKSTDateWithin30Days(),
  },
  {
    id: 3n,
    title: "시각장애인을 위한 읽어주는 쇼핑 대화형 AI '소담' 개발 회고",
    summary:
      '오늘은 많은 학과 교수님들의 관심과 대회에서 큰 상을 받았던 팀 프로젝트를 진행한 경험을 회고하고자 한다. 이 프로젝트를 통해 나는 인공지능에 대한 큰 흥미를 가지게 되었고, 그것이 가진 잠재력을 몸소 깨닫게 되었다.',
    thumbnailUrl:
      'https://velog.velcdn.com/images/dongho18/post/192f676d-70e5-48e1-9ab1-db8b0b88336c/image.png',
    originalUrl:
      'https://velog.io/@dongho18/%EC%8B%9C%EA%B0%81%EC%9E%A5%EC%95%A0%EC%9D%B8%EC%9D%84-%EC%9C%84%ED%95%9C-%EC%9D%BD%EC%96%B4%EC%A3%BC%EB%8A%94-%EC%87%BC%ED%95%91-%EB%8C%80%ED%99%94%ED%98%95-AI-%EC%86%8C%EB%8B%B4-%EA%B0%9C%EB%B0%9C-%ED%9A%8C%EA%B3%A0',
    likeCount: 18,
    viewCount: 45,
    createdAt: getRandomKSTDateWithin30Days(),
  },
  {
    id: 4n,
    title: '대학가 주변 맛집 소개 <eatGNU> 제작 회고',
    summary:
      '오늘은 맛집 소개 웹사이트 개발 회고를 써보려고 한다. 이 프로젝트를 통해 나는 HTML, CSS, JavaScript를 배워보고, 웹사이트 개발을 해보았다.',
    thumbnailUrl:
      'https://images.velog.io/images/dongho18/post/1108ec5d-f22f-494a-aaf9-4bfb442d5744/ezgif.com-gif-maker%20(4).gif',
    originalUrl: 'https://velog.io/@dongho18/eatGNU-%EC%A0%9C%EC%9E%91-%ED%9A%8C%EA%B3%A0',
    likeCount: 23,
    viewCount: 56,
    createdAt: getRandomKSTDateWithin30Days(),
  },
  {
    id: 5n,
    title: '[Troubleshooting] Jenkins에서 docker-compose 명령 수행 시 Permission denied 에러',
    summary:
      '문제 상황 컨테이너에서 돌아가고 있는 젠킨스에서 docker-compose 명령을 수행하면 다음과 같이 Permission denied 가 뜨는 상황 호스트',
    thumbnailUrl:
      'https://blog.kakaocdn.net/dna/cvvH0t/btsGARuyalQ/AAAAAAAAAAAAAAAAAAAAADfCeSkOpGF8A2cJrdj3nqB5wPbp1gyjjoNeSYy5Nj8I/img.jpg?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1769871599&allow_ip=&allow_referer=&signature=5JTWm270u4hkorguC%2FB6fluYOrg%3D',
    originalUrl: 'https://dongho-dev.tistory.com/58',
    likeCount: 30,
    viewCount: 67,
    createdAt: getRandomKSTDateWithin30Days(),
  },
  {
    id: 6n,
    title: '[JavaScript] 프로그래머스 다리를 지나는 트럭',
    summary:
      '이 글은 프로그래머스 다리를 지나는 트럭을 풀이한다. 코드는 JavaScript로 구현하였다. 문제 설명 트럭 여러 대가 강을 가로지르는 일차선',
    thumbnailUrl:
      'https://blog.kakaocdn.net/dna/b4Lqqv/btsuPPH2nwV/AAAAAAAAAAAAAAAAAAAAABrjP9tyQyjY55WIfZSMZKx4tY0iFkMpzxV33UXupH10/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1769871599&allow_ip=&allow_referer=&signature=sj9uJKxedJv3CKVX4Jiaeivpz3k%3D',
    originalUrl: 'https://velog.io/@dongho18/eatGNU-%EC%A0%9C%EC%9E%91-%ED%9A%8C%EA%B3%A0',
    likeCount: 36,
    viewCount: 78,
    createdAt: getRandomKSTDateWithin30Days(),
  },
  {
    id: 7n,
    title: '[JavaScript] 프로그래머스 프로세스',
    summary: '운영체제의 역할 중 하나는 컴퓨터 시스템의 자원을 효율적으로 관리하는 것입니다.',
    thumbnailUrl:
      'https://blog.kakaocdn.net/dna/z7znR/btstRsfwV81/AAAAAAAAAAAAAAAAAAAAAFv7vsEhkeeKYTLfJlx1khAcjxe35giNH-AZ3SFzZhuw/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1769871599&allow_ip=&allow_referer=&signature=eF2%2BLmnT2TOJJnsklIUuEONRjPo%3D',
    originalUrl:
      'https://blog.kakaocdn.net/dna/uaQo9/btsuqDBgkSH/AAAAAAAAAAAAAAAAAAAAAB2_LpoK9cc7JKyKBdh6LVb-z2rRkTEwqfZ-AAphs2aL/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1769871599&allow_ip=&allow_referer=&signature=cudH0ZeezoIE2CSsg2CZVTk6MJw%3D',
    likeCount: 42,
    viewCount: 89,
    createdAt: getRandomKSTDateWithin30Days(),
  },
  {
    id: 8n,
    title: '[JavaScript] 프로그래머스 주식가격',
    summary: '이 글은 프로그래머스 주식가격을 풀이한다. 코드는 JavaScript로 구현하였다.',
    thumbnailUrl:
      'https://blog.kakaocdn.net/dna/z7znR/btstRsfwV81/AAAAAAAAAAAAAAAAAAAAAFv7vsEhkeeKYTLfJlx1khAcjxe35giNH-AZ3SFzZhuw/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1769871599&allow_ip=&allow_referer=&signature=eF2%2BLmnT2TOJJnsklIUuEONRjPo%3D',
    originalUrl: 'https://dongho-dev.tistory.com/55',
    likeCount: 48,
    viewCount: 100,
    createdAt: getRandomKSTDateWithin30Days(),
  },
  {
    id: 9n,
    title: '[JavaScript] 프로그래머스 올바른 괄호',
    summary: '이 글은 프로그래머스 올바른 괄호를 풀이한다. 코드는 JavaScript로 구현하였다.',
    thumbnailUrl:
      'https://blog.kakaocdn.net/dna/bcHrki/btstsNxy2xI/AAAAAAAAAAAAAAAAAAAAAHCoT_3w7fdE614jlE7AiaQwE2FwonK1HO4OxB51ZRZO/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1769871599&allow_ip=&allow_referer=&signature=GSu4vO%2FCV8QELNv2BvyPpjG%2B%2FYk%3D',
    originalUrl: 'https://dongho-dev.tistory.com/54',
    likeCount: 54,
    viewCount: 111,
    createdAt: getRandomKSTDateWithin30Days(),
  },
  {
    id: 10n,
    title: '[JavaScript] 프로그래머스 베스트앨범',
    summary: '이 글은 프로그래머스 베스트앨범을 풀이한다. 코드는 JavaScript로 구현하였다.',
    thumbnailUrl:
      'https://blog.kakaocdn.net/dna/boIvm4/btssZgnVkWq/AAAAAAAAAAAAAAAAAAAAAEpfASxG8WJXnbtOKo2QCJ-MnUy2uIR5U6Hgf7ZhkgiX/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1769871599&allow_ip=&allow_referer=&signature=%2FGEc25CKQd0Iu5PQxi6qCK1mTcg%3D',
    originalUrl: 'https://dongho-dev.tistory.com/53',
    likeCount: 60,
    viewCount: 122,
    createdAt: getRandomKSTDateWithin30Days(),
  },
];

/**
 * upsert 헬퍼 함수
 */
async function upsertStory(prisma: PrismaClient, story: Story, contents: string) {
  return await prisma.story.upsert({
    where: { id: story.id },
    update: {},
    create: {
      title: story.title,
      summary: story.summary,
      contents,
      thumbnailUrl: story.thumbnailUrl,
      originalUrl: story.originalUrl,
      likeCount: story.likeCount,
      viewCount: story.viewCount,
      createdAt: story.createdAt,
      member: { connect: { id: 1n } },
      rssFeed: { connect: { id: 1n } },
    },
  });
}

/**
 * Story 도메인 시드 데이터 생성
 */
export async function seedStories(prisma: PrismaClient) {
  console.log('📖 Seeding stories...');

  const createdStories: Story[] = [];

  for (let i = 0; i < stories.length; i++) {
    const story = stories[i];
    const contents = readMarkdownFile(`story-${i + 1}.md`);
    const createdStory = await upsertStory(prisma, story as Story, contents);
    createdStories.push(createdStory);
    console.log(`✅ Created story: ${story.title}`);
  }

  return createdStories;
}
