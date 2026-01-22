import { readFileSync } from 'fs';
import { join } from 'path';

/**
 * 마크다운 파일 읽기 헬퍼 함수
 */
export function readMarkdownFile(filename: string, domain: string = 'stories'): string {
  const filePath = join(__dirname, '..', '..', 'fixtures', domain, filename);
  return readFileSync(filePath, 'utf-8');
}

/**
 * 마크다운 frontmatter 파싱 헬퍼 함수
 */
export function parseMarkdownWithFrontmatter(content: string): {
  metadata: Record<string, any>;
  content: string;
} {
  // frontmatter가 있는지 확인 (--- 로 시작하는지)
  const frontmatterRegex = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/;
  const match = content.match(frontmatterRegex);

  if (!match) {
    // frontmatter가 없으면 전체를 content로 반환
    return { metadata: {}, content };
  }

  const [, frontmatterString, markdownContent] = match;

  // frontmatter를 객체로 파싱
  const metadata: Record<string, any> = {};
  const lines = frontmatterString.split('\n');

  for (const line of lines) {
    const colonIndex = line.indexOf(':');
    if (colonIndex > 0) {
      const key = line.substring(0, colonIndex).trim();
      let value: any = line.substring(colonIndex + 1).trim();

      // 배열 형식인지 확인 (예: ['item1', 'item2'])
      if (value.startsWith('[') && value.endsWith(']')) {
        try {
          // JSON.parse를 사용하여 배열 파싱 (작은따옴표를 큰따옴표로 변환)
          value = JSON.parse(value.replace(/'/g, '"'));
        } catch (e) {
          // 파싱 실패시 문자열 그대로 유지
        }
      }

      metadata[key] = value;
    }
  }

  return { metadata, content: markdownContent };
}
