import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
// 데코레이터 이름은 @Public() 사용을 위해 PascalCase 유지
// eslint-disable-next-line @typescript-eslint/naming-convention -- decorator API
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
