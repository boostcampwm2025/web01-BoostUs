import { BadRequestException } from '@nestjs/common';
export type CursorPayload =
  | { sort: 'LATEST'; v: string; id: string }
  | { sort: 'LIKES'; v: number; id: string }
  | { sort: 'VIEWS'; v: number; id: string };

export function encodeCursor(payload: CursorPayload) {
  return Buffer.from(JSON.stringify(payload), 'utf8').toString('base64url');
}

export function isCursorPayload(x: unknown): x is CursorPayload {
  if (!x || typeof x !== 'object') return false;

  const o = x as Record<string, unknown>;
  const sort = o.sort;
  const v = o.v;
  const id = o.id;

  if (typeof id !== 'string') return false;

  if (sort === 'LATEST') return typeof v === 'string';
  if (sort === 'LIKES' || sort === 'VIEWS') return typeof v === 'number';
  return false;
}

export function decodeCursor(cursor: string): CursorPayload {
  try {
    const raw: unknown = JSON.parse(Buffer.from(cursor, 'base64url').toString('utf8'));

    if (!isCursorPayload(raw)) {
      throw new BadRequestException('Invalid cursor');
    }

    return raw;
  } catch {
    throw new BadRequestException('Invalid cursor');
  }
}
