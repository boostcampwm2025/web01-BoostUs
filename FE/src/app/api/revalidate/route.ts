import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export function POST(request: NextRequest) {
  const path = request.nextUrl.searchParams.get('path');

  if (path) {
    revalidatePath(path);
    return NextResponse.json({ revalidated: true, now: Date.now() });
  }

  return NextResponse.json({ revalidated: false }, { status: 400 });
}
