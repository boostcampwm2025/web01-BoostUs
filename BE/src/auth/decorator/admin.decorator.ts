import { SetMetadata } from '@nestjs/common';

export const IS_ADMIN_KEY = 'isAdmin';
// 데코레이터 이름은 @IsAdmin() 사용을 위해 PascalCase 유지
// eslint-disable-next-line @typescript-eslint/naming-convention -- decorator API
export const IsAdmin = () => SetMetadata(IS_ADMIN_KEY, true);
