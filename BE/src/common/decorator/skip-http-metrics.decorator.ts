import { SetMetadata } from '@nestjs/common';

export const SKIP_HTTP_METRICS_KEY = 'skipHttpMetrics';
export const skipHttpMetrics = () => SetMetadata(SKIP_HTTP_METRICS_KEY, true);
