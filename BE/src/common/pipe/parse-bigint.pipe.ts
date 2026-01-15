import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

/**
 * BigInt 파싱 파이프
 * URL 파라미터나 쿼리 스트링을 BigInt로 변환
 */
@Injectable()
export class ParseBigIntPipe implements PipeTransform<string, bigint> {
  transform(value: string): bigint {
    try {
      return BigInt(value);
    } catch {
      throw new BadRequestException('Invalid BigInt format');
    }
  }
}
