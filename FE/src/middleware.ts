import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const middleware = (request: NextRequest) => {
  // 1. 쿠키에서 방문 여부 확인
  const hasVisited = request.cookies.get('has_visited_service');
  const { pathname } = request.nextUrl;

  // 2. 메인 페이지('/')에 접속했는데 방문 기록이 없는 경우
  if (pathname === '/' && !hasVisited) {
    const url = request.nextUrl.clone();
    url.pathname = '/landing';

    const response = NextResponse.redirect(url);

    // 3. 브라우저를 닫아도 유지되도록 만료 기간 설정
    response.cookies.set('has_visited_service', 'true', {
      maxAge: 60 * 60 * 24 * 365, // 1 year in seconds
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
    });

    return response;
  }

  // 4. 이미 방문했거나 다른 경로인 경우 그대로 통과
  return NextResponse.next();
};

// 메인 경로에서만 실행되도록 설정
export const config = {
  matcher: '/',
};
