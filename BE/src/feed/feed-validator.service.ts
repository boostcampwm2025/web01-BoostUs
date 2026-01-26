import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { InvalidFeedUrlException } from './exception/feed.exception';

@Injectable()
export class FeedValidatorService {
  constructor(private readonly httpService: HttpService) { }

  /**
   * 허용된 도메인인지 검증 (velog, tistory만 허용)
   */
  private validateAllowedDomain(feedUrl: string): void {
    let url: URL;
    try {
      url = new URL(feedUrl);
    } catch {
      throw new InvalidFeedUrlException(
        '유효하지 않은 URL 형식입니다.',
        { feedUrl },
      );
    }

    const hostname = url.hostname.toLowerCase();
    const pathname = url.pathname.toLowerCase();

    // Velog RSS 검증: v2.velog.io 도메인이고 /rss 경로를 포함해야 함
    const isVelog =
      hostname === 'v2.velog.io' && pathname.startsWith('/rss');

    // Tistory RSS 검증: *.tistory.com 도메인이고 /rss 경로를 포함해야 함
    const isTistory =
      hostname.endsWith('.tistory.com') && pathname === '/rss';

    if (!isVelog && !isTistory) {
      throw new InvalidFeedUrlException(
        'velog 또는 tistory RSS 피드만 등록할 수 있습니다.'
      );
    }
  }

  async validateFeedUrl(feedUrl: string): Promise<void> {
    // 도메인 검증: velog 또는 tistory RSS만 허용
    this.validateAllowedDomain(feedUrl);

    try {
      const response = await firstValueFrom(
        this.httpService.get(feedUrl, {
          headers: {
            'User-Agent': 'BoostUs-RSS-Validator/1.0',
            Accept: 'application/rss+xml, application/xml, text/xml, */*',
          },
          timeout: 3000,
        }),
      );

      if (response.status !== 200) {
        throw new InvalidFeedUrlException(
          `RSS 피드에 접근할 수 없습니다. HTTP ${response.status}: ${response.statusText}`,
          {
            feedUrl,
            statusCode: response.status,
            statusText: response.statusText,
          },
        );
      }

      // Content-Type 검증 (접근 가능 여부만 확인)
      const contentType = response.headers['content-type']?.toLowerCase() ?? '';
      const isXml =
        contentType.includes('application/rss+xml') ||
        contentType.includes('application/xml') ||
        contentType.includes('text/xml') ||
        contentType.includes('application/atom+xml');

      // XML이 아니어도 data가 있으면 통과 (실제 파싱은 crawler 책임)
      if (!isXml && !response.data) {
        throw new InvalidFeedUrlException(
          'RSS 피드 형식이 올바르지 않습니다.',
          { feedUrl },
        );
      }
    } catch (error) {
      if (error instanceof InvalidFeedUrlException) {
        throw error;
      }

      throw new InvalidFeedUrlException(
        this.resolveErrorMessage(error),
        {
          feedUrl,
          statusCode: error?.response?.status,
        },
      );
    }
  }

  /**
   * RSS 접근 실패 에러 메시지 결정
   */
  private resolveErrorMessage(error: any): string {
    const DEFAULT_MESSAGE =
      'RSS 피드에 접근할 수 없습니다. URL을 확인해주세요.';

    const status = error?.response?.status;
    if (status) {
      const statusMessageMap: Record<number, string> = {
        404: 'RSS 피드를 찾을 수 없습니다. URL을 확인해주세요.',
      };

      return (
        statusMessageMap[status] ??
        `RSS 피드에 접근할 수 없습니다. HTTP ${status}`
      );
    }

    if (error?.message?.includes('timeout')) {
      return 'RSS 피드 응답 시간이 초과되었습니다. URL을 확인해주세요.';
    }

    return DEFAULT_MESSAGE;
  }
}
