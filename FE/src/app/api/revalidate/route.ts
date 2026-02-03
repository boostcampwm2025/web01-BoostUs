import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export function POST(request: NextRequest) {
  try {
    // 1. 헤더에서 시크릿 토큰 추출
    const secret = request.headers.get('x-revalidate-secret');

    // 2. 토큰 유효성 검사 (401 Unauthorized)
    if (secret !== process.env.REVALIDATE_SECRET) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    // 3. Query Parameter에서 path 확인
    const path = request.nextUrl.searchParams.get('path');

    // 4. 경로 누락 시 처리 (400 Bad Request)
    if (!path) {
      return NextResponse.json(
        { message: 'Missing path param' },
        { status: 400 }
      );
    }

    // 5. 캐시 무효화 실행 (비동기 처리 및 에러 핸들링)
    revalidatePath(path);

    // 6. 성공 응답 (200 OK)
    return NextResponse.json({ revalidated: true, now: Date.now() });
  } catch (error) {
    // 7. 서버 에러 처리 (500 Internal Server Error)
    console.error('Revalidation error:', error);
    return NextResponse.json(
      { message: 'Error revalidating' },
      { status: 500 }
    );
  }
}
