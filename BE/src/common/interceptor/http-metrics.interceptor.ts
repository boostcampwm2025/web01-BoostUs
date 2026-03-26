import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import type { Request, Response } from 'express';
import type { Counter, Histogram } from 'prom-client';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { SKIP_HTTP_METRICS_KEY } from '../decorator/skip-http-metrics.decorator';

type HttpMetricLabels = 'method' | 'route' | 'status_code';

@Injectable()
export class HttpMetricsInterceptor implements NestInterceptor {
  constructor(
    private readonly reflector: Reflector,
    @InjectMetric('http_requests_total')
    private readonly requestCounter: Counter<HttpMetricLabels>, //계속 증가만 하는 메트릭
    @InjectMetric('http_request_duration_seconds')
    private readonly requestDurationHistogram: Histogram<HttpMetricLabels>, //히스토그램 타입 메트릭
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    if (context.getType() !== 'http') {
      //http 요청일 때에만 메트릭 수집
      return next.handle();
    }
    // 메트릭 수집 엔드포인트는 메트릭 수집 대상에 포함시키기 않기 위한 설정
    const shouldSkip = this.reflector.getAllAndOverride<boolean>(SKIP_HTTP_METRICS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (shouldSkip) {
      return next.handle();
    }

    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    const startedAt = process.hrtime.bigint();
    //일반적인 상황에서 메트릭 기록 (요청처리가 끝난 경우에)
    return next.handle().pipe(
      finalize(() => {
        const durationInSeconds = Number(process.hrtime.bigint() - startedAt) / 1_000_000_000;
        const labels = {
          method: request.method,
          route: this.getRouteLabel(request),
          status_code: String(response.statusCode),
        };

        this.requestCounter.inc(labels);
        this.requestDurationHistogram.observe(labels, durationInSeconds);
      }),
    );
  }

  private getRouteLabel(request: Request): string {
    const route = request.route as unknown;
    const routePath = this.getRoutePath(route);

    if (typeof routePath === 'string') {
      return `${request.baseUrl ?? ''}${routePath}`;
    }

    if (Array.isArray(routePath)) {
      return `${request.baseUrl ?? ''}${routePath.join('|')}`;
    }

    return request.baseUrl || request.path || 'unknown';
  }

  private getRoutePath(route: unknown): string | string[] | undefined {
    if (!this.isRouteWithPath(route)) {
      return undefined;
    }

    return route.path;
  }

  private isRouteWithPath(route: unknown): route is { path: string | string[] } {
    if (typeof route !== 'object' || route === null || !('path' in route)) {
      return false;
    }

    const routePath = route.path;
    return typeof routePath === 'string' || Array.isArray(routePath);
  }
}
