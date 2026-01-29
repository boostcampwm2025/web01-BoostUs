import { Injectable, Inject } from '@nestjs/common';
import type Redis from 'ioredis';
import { REDIS } from '../redis/redis.provider';

export interface ViewCountResult<T> {
  data: T;
  viewIncremented: boolean;
}

@Injectable()
export class ViewService {
  constructor(@Inject(REDIS) private readonly redis: Redis) {}

  /**
   * 조회수 증가 여부를 판단합니다.
   * @param resource 리소스 타입 (예: 'project', 'story', 'qna')
   * @param resourceId 리소스 ID
   * @param viewerKey 조회자 키
   * @param ttl TTL (초 단위, 기본 30분)
   * @returns 첫 조회 여부
   */
  async shouldIncrementView(
    resource: string,
    resourceId: number | bigint,
    viewerKey: string,
    ttl: number = 60 * 30,
  ): Promise<boolean> {
    const redisKey = `view:${resource}:${resourceId}:${viewerKey}`;

    /*
     * 'NX' (Not eXists)
     * 이 key가 존재하지 않을 때만 SET 하라
     * -> key 없음 + SET 성공 = 'OK' 반환
     * -> key 이미 존재 + NX 조건 때문에 SET 스킵 = null 반환
     */
    const firstView = await this.redis.set(redisKey, 'true', 'EX', ttl, 'NX');

    return firstView === 'OK';
  }

  /**
   * 여러 리소스의 조회 기록을 확인합니다.
   */
  async hasViewed(
    resource: string,
    resourceId: number | bigint,
    viewerKey: string,
  ): Promise<boolean> {
    const redisKey = `view:${resource}:${resourceId}:${viewerKey}`;
    const exists = await this.redis.exists(redisKey);
    return exists === 1;
  }

  /**
   * 조회 기록을 삭제합니다 (관리자 기능 등에 활용)
   */
  async clearViewRecord(
    resource: string,
    resourceId: number | bigint,
    viewerKey: string,
  ): Promise<void> {
    const redisKey = `view:${resource}:${resourceId}:${viewerKey}`;
    await this.redis.del(redisKey);
  }

  /**
   * 특정 리소스의 모든 조회 기록을 삭제합니다
   */
  async clearAllViewRecords(resource: string, resourceId: number | bigint): Promise<void> {
    const pattern = `view:${resource}:${resourceId}:*`;
    const keys = await this.redis.keys(pattern);

    if (keys.length > 0) {
      await this.redis.del(...keys);
    }
  }
}
