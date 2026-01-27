import { gfm } from '@truto/turndown-plugin-gfm';
import Parser from 'rss-parser';
import TurndownService from 'turndown';
import { CreateStoryRequest, RssItem } from './types';

/**
 * Feed Parser
 * RSS XML을 파싱하여 Story 객체로 변환합니다.
 */
export class FeedParser {
  private parser: Parser;
  private turndownService: TurndownService; // HTML -> Markdown 변환 라이브러리

  constructor() {
    this.parser = new Parser();
    this.turndownService = new TurndownService({
      headingStyle: 'atx',        // ### 스타일
      bulletListMarker: '-',      // - 리스트
      codeBlockStyle: 'fenced',   // ``` 코드블럭
      fence: '```',
      emDelimiter: '*',
      strongDelimiter: '**',
      br: '\n',                   // <br> → 줄바꿈
    });
    this.turndownService.use(gfm);
    this.turndownService.addRule('lineBreak', {
      filter: 'br',
      replacement: () => '  \n'
    });
    this.turndownService.addRule('listItem', {
      filter: 'li',
      replacement: function (content, node, options) {
        const marker = options.bulletListMarker + ' '
        // 첫 줄 공백 제거 + 줄바꿈 정리
        content = content
          .replace(/^\s+/, '')
          .replace(/\n+/g, ' ')
          .trim()

        return marker + content + '\n'
      }
    });
    this.turndownService.addRule('safeCodeBlock', {
      filter(node) {
        return (
          node.nodeName === 'PRE' &&
          node.firstChild &&
          node.firstChild.nodeName === 'CODE'
        )
      },
      replacement(_, node, options) {
        const code = node.textContent ?? ''
        const fence = options.fence || '```'

        return (
          '\n\n' +
          fence + '\n' +
          code.replace(/\n$/, '') +
          '\n' + fence +
          '\n\n'
        )
      },
    })
    this.turndownService.addRule('safeHeading', {
      filter: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
      replacement(content, node) {
        const level = Number(node.nodeName.charAt(1))
        return `\n\n${'#'.repeat(level)} ${content.trim()}\n\n`
      },
    })


  }

  /**
   * RSS XML을 파싱하여 Story 생성 요청 데이터로 변환
   * @param xmlContent RSS XML 문자열
   * @param feedId 피드 ID
   * @returns CreateStoryRequest 배열
   */
  async parse(xmlContent: string, feedId: string): Promise<CreateStoryRequest[]> {
    try {
      console.log('🔍 Parsing RSS feed...');

      const feed = await this.parser.parseString(xmlContent);

      if (!feed.items || feed.items.length === 0) {
        console.warn('⚠️  No items found in feed');
        return [];
      }


      // RSS 아이템을 Story 생성 요청 객체로 변환
      const convertedStories = feed.items.map((item) =>
        this.convertToStory(item as RssItem, feedId),
      );

      // 유효하지 않은 항목(null) 제거
      const validStories = convertedStories.filter(
        (story): story is CreateStoryRequest => story !== null,
      );

      console.log(`✅ Parsed ${validStories.length} valid story(ies)`);
      return validStories;
    } catch (error) {
      throw new Error(`Failed to parse RSS feed: ${error}`);
    }
  }

  /**
   * RSS Item을 Story 생성 요청 데이터로 변환
   * @param item RSS Item
   * @param feedId 피드 ID
   * @returns CreateStoryRequest 또는 null
   */
  private convertToStory(item: RssItem, feedId: string): CreateStoryRequest | null {
    // 필수 필드 검증
    if (!item.guid || !item.title) {
      console.warn('⚠️  Skipping item without guid or title:', item);
      return null;
    }

    // 본문 콘텐츠 추출
    const contents = item.content || '';

    if (!contents) {
      console.warn('⚠️  Skipping item without content:', item.title);
      return null;
    }

    // 콘텐츠 HTML -> Markdown 변환
    const markdownContents = this.convertToMarkdown(contents);

    // 요약 추출
    let summary = this.extractSummary(contents);

    // 발행일 파싱 (없으면 현재 시간)
    const publishedAt = item.pubDate
      ? new Date(item.pubDate).toISOString()
      : new Date().toISOString();

    return {
      feedId,
      guid: item.guid,
      title: this.decodeHtmlEntities(item.title),
      summary,
      contents: markdownContents,
      thumbnailUrl: this.extractImageUrl(contents),
      originalUrl: item.link,
      publishedAt,
    };
  }

  /**
   * HTML 콘텐츠를 Markdown 콘텐츠로 변환
   * @param html HTML 문자열
   * @returns Markdown 문자열
   */
  private convertToMarkdown(html: string): string {
    return this.turndownService.turndown(html);
  }

  /**
   * HTML 태그를 제거하고 첫 150자를 추출하여 요약 생성
   * @param html HTML 문자열
   * @returns 요약 문자열
   */
  private extractSummary(html: string): string {
    // HTML 태그 제거
    const text = html.replace(/<[^>]*>/g, '');

    // HTML 엔티티 디코딩
    const decoded = this.decodeHtmlEntities(text);

    // 연속된 공백 제거
    const cleaned = decoded.replace(/\s+/g, ' ').trim();

    // 첫 150자 추출
    return cleaned.length > 150 ? cleaned.substring(0, 150) + '...' : cleaned;
  }

  /**
   * HTML 엔티티를 일반 문자로 디코딩
   */
  private decodeHtmlEntities(text: string): string {
    const entities: Record<string, string> = {
      '&nbsp;': ' ',
      '&amp;': '&',
      '&lt;': '<',
      '&gt;': '>',
      '&quot;': '"',
      '&#39;': "'",
      '&apos;': "'",
      '&ndash;': '–',
      '&mdash;': '—',
      '&hellip;': '…',
    };

    let result = text;
    for (const [entity, char] of Object.entries(entities)) {
      result = result.replace(new RegExp(entity, 'g'), char);
    }

    // 숫자 엔티티 디코딩 (&#123; 또는 &#xAB; 형식)
    result = result.replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(parseInt(code, 10)));
    result = result.replace(/&#x([0-9A-Fa-f]+);/g, (_, code) =>
      String.fromCodePoint(parseInt(code, 16)),
    );

    return result;
  }

  /**
   * HTML 콘텐츠에서 첫 번째 이미지 URL 추출
   */
  private extractImageUrl(html: string): string | undefined {
    if (!html) {
      return undefined;
    }

    // <img 태그의 src 속성만 정확히 추출
    const imgMatch = html.match(/<img\s+[^>]*?src=["']([^"']+)["']/i);
    const imageUrl = imgMatch ? imgMatch[1] : '';

    // 이미지 URL 검증
    if (!this.isValidImageUrl(imageUrl)) {
      return undefined;
    }

    return imageUrl;
  }

  /**
   * 이미지 URL 검증
   * @param url 이미지 URL
   * @returns 검증 결과
   */
  private isValidImageUrl(url: string): boolean {
    // HTTPS만 허용
    if (!url.startsWith('https://')) {
      return false;
    }

    // Placeholder 이미지 필터링
    const blacklist = [
      'no-image',
      'noimage',
      'placeholder',
      'default-image',
      'default_image',
      'tistory_admin/static/images/no-image',
    ];

    const lowerUrl = url.toLowerCase();
    if (blacklist.some((pattern) => lowerUrl.includes(pattern))) {
      return false;
    }

    // 이미지 확장자 검증 (선택사항)
    const imageExtensions = /\.(jpg|jpeg|png|gif|webp)(\?|$)/i;
    // 확장자가 있으면 확인, 없으면 일단 허용 (CDN URL 등)
    if (url.match(/\.[a-z]+(\?|$)/i) && !imageExtensions.test(url)) {
      return false;
    }

    return true;
  }
}
