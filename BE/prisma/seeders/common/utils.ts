import { readFileSync } from 'fs';
import { join } from 'path';

/**
 * 마크다운 파일 읽기 헬퍼 함수
 */
export function readMarkdownFile(filename: string): string {
  const filePath = join(__dirname, '..', '..', 'fixtures', 'stories', filename);
  return readFileSync(filePath, 'utf-8');
}
