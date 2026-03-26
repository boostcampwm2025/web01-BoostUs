import { Controller, Get, Res } from '@nestjs/common';
import { PrometheusController } from '@willsoto/nestjs-prometheus';
import type { Response } from 'express';
import { Public } from '../auth/decorator/public.decorator';
import { rawResponse } from '../common/decorator/raw-response.decorator';
import { skipHttpMetrics } from '../common/decorator/skip-http-metrics.decorator';

@Controller()
export class MetricsController extends PrometheusController {
  @Public()
  @rawResponse()
  @skipHttpMetrics() //메트릭 수집 api는 메트릭에 포함되면 안된다.
  @Get()
  override index(@Res({ passthrough: true }) response: Response) {
    return super.index(response);
  }
}
