import { Global, Module } from '@nestjs/common';
import {
  PrometheusModule,
  makeCounterProvider,
  makeHistogramProvider,
} from '@willsoto/nestjs-prometheus';
import { HttpMetricsInterceptor } from '../common/interceptor/http-metrics.interceptor';
import { MetricsController } from './metrics.controller';

@Global() //메트릭 모듈은 전역으로 등록
@Module({
  imports: [
    PrometheusModule.register({
      global: true,
      controller: MetricsController,
      defaultMetrics: {
        enabled: false,
      },
    }),
  ],
  providers: [
    makeCounterProvider({
      name: 'http_requests_total',
      help: 'Total number of HTTP requests handled by NestJS',
      labelNames: ['method', 'route', 'status_code'],
    }),
    makeHistogramProvider({
      name: 'http_request_duration_seconds',
      help: 'HTTP request duration in seconds for NestJS routes',
      labelNames: ['method', 'route', 'status_code'],
      buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5],
    }),
    HttpMetricsInterceptor,
  ],
  exports: [HttpMetricsInterceptor],
})
export class MetricsModule {}
