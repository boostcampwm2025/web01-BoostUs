import { Injectable, Inject, Logger } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import type Redis from 'ioredis';
import { REDIS } from '../redis/redis.provider';
import { PrismaService } from '../prisma/prisma.service';

const FLUSH_INTERVAL_MS = 5000;

export const RESOURCES = ['story', 'project', 'question'] as const;
export type Resource = (typeof RESOURCES)[number];

interface ViewDelta {
  id: bigint;
  delta: number;
}

@Injectable()
export class ViewFlushService {
  private readonly logger = new Logger(ViewFlushService.name);

  constructor(
    @Inject(REDIS) private readonly redis: Redis,
    private readonly prisma: PrismaService,
  ) { }

  @Interval(FLUSH_INTERVAL_MS)
  async flush(): Promise<void> {
    for (const resource of RESOURCES) {
      await this.flushResource(resource);
    }
  }

  private async flushResource(resource: Resource): Promise<void> {
    const dirtyKey = `view:dirty:${resource}`;

    const ids = await this.redis.smembers(dirtyKey);
    if (ids.length === 0) return;

    // pipeline으로 각 id의 카운터를 atomic하게 가져오면서 키 삭제
    const pipeline = this.redis.pipeline();
    for (const id of ids) {
      pipeline.get(`view:count:${resource}:${id}`);
    }
    const results = await pipeline.exec();

    const updates: ViewDelta[] = [];
    if (results) {
      for (let i = 0; i < ids.length; i++) {
        /**
         * result 구조:
         * [null, '5'] → [에러없음, 이전값 '5']
         * [null, null] → [에러없음, 이전값 없음]
         */
        const [err, raw] = results[i] as [Error | null, unknown];
        if (err || raw === null || raw === undefined) continue;

        let rawStr: string;
        if (typeof raw === 'string') rawStr = raw;
        else if (typeof raw === 'number' || typeof raw === 'bigint') rawStr = raw.toString();
        else if (Buffer.isBuffer(raw)) rawStr = raw.toString('utf8');
        else continue;

        const delta = parseInt(rawStr, 10);
        if (delta > 0) {
          updates.push({ id: BigInt(ids[i]), delta });
        }
      }
    }

    if (updates.length === 0) {
      await this.redis.srem(dirtyKey, ...ids);
      return;
    }

    try {
      // 먼저 DB 업데이트
      await this.batchUpdate(resource, updates);

      // 카운터 키 삭제
      const delPipeline = this.redis.pipeline();
      for (const { id } of updates) {
        delPipeline.del(`view:count:${resource}:${id}`);
      }
      await delPipeline.exec();

      // dirty set 삭제
      await this.redis.srem(dirtyKey, ...ids);
    } catch (err) {
      this.logger.error(
        `[ViewFlush] ${resource} batch update 실패, 다음 배치에서 재처리됩니다`,
        err instanceof Error ? err.stack : String(err),
      );
    }
  }

  private async batchUpdate(resource: Resource, updates: ViewDelta[]): Promise<void> {
    switch (resource) {
      case 'story':
        await this.prisma.$transaction(
          updates.map(({ id, delta }) =>
            this.prisma.story.update({
              where: { id },
              data: { viewCount: { increment: delta } },
            }),
          ),
        );
        break;
      case 'project':
        await this.prisma.$transaction(
          updates.map(({ id, delta }) =>
            this.prisma.project.update({
              where: { id },
              data: { viewCount: { increment: delta } },
            }),
          ),
        );
        break;
      case 'question':
        await this.prisma.$transaction(
          updates.map(({ id, delta }) =>
            this.prisma.question.update({
              where: { id },
              data: { viewCount: { increment: delta } },
            }),
          ),
        );
        break;
    }

    this.logger.log(`[ViewFlush] ${resource} ${updates.length}건 반영 완료`);
  }
}
