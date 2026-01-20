import NextAuth, { NextAuthOptions } from 'next-auth';
import GithubProvider from 'next-auth/providers/github';

export const authOptions: NextAuthOptions = {
  providers: [
    GithubProvider({
      // 1. Env 에러 해결: ! 대신 ?? "" 사용 (undefined면 빈 문자열 할당)
      clientId: process.env.GITHUB_ID ?? '',
      clientSecret: process.env.GITHUB_SECRET ?? '',
      authorization: {
        params: {
          scope: 'read:user user:email repo read:org',
        },
      },
    }),
  ],

  // 2. trustHost 타입 에러 해결: TS 무시 주석 추가 (도커환경 필수 설정임)
  // @ts-expect-error: trustHost option is valid in runtime but missing in some type definitions
  trustHost: true,

  callbacks: {
    jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token ?? '';
      }
      return token;
    },
    session({ session, token }) {
      // [수정] 여기도 'as string' 제거. token.accessToken이 없으면 빈 문자열 할당
      // (타입 정의 덕분에 token.accessToken을 알아들으니 그냥 ??만 써도 됨)
      session.accessToken = token.accessToken ?? '';
      return session;
    },
  },
};

// 라이브러리 타입 문제로 인한 ESLint 에러 무시 설정
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
