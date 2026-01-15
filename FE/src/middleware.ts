import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // 1. 요청의 출처(Origin) 확인
  const origin = request.headers.get('origin') || '';

  // 2. 허용할 출처 설정 (지금 5173이므로 특정해서 허용하거나 *로 전체 허용)
  // 보안을 위해 나중에는 'http://localhost:5173' 처럼 특정하는 게 좋습니다.
  const allowedOrigin = origin; // 지금은 개발 편의상 요청 온 origin을 그대로 허용

  // 3. 'OPTIONS' 요청(Preflight)이면 즉시 200 응답 보내기 (중요!)
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*', // 또는 allowedOrigin
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  }

  // 4. 일반 요청(GET, POST 등) 처리
  const response = NextResponse.next();

  // 응답 헤더에 CORS 정보 추가
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, OPTIONS'
  );
  response.headers.set(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization'
  );

  return response;
}

export const config = {
  matcher: '/:path*',
};
