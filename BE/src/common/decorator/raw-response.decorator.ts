import { SetMetadata } from '@nestjs/common';

export const RAW_RESPONSE_KEY = 'rawResponse';
export const rawResponse = () => SetMetadata(RAW_RESPONSE_KEY, true);
