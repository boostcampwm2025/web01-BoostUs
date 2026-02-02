import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { RequestWithViewerKey } from '../guard/view.guard';

// 데코레이터 이름은 @ViewerKey() 사용을 위해 PascalCase 유지
// eslint-disable-next-line @typescript-eslint/naming-convention -- decorator API
export const ViewerKey = createParamDecorator((_: unknown, ctx: ExecutionContext): string => {
  const req = ctx.switchToHttp().getRequest<RequestWithViewerKey>();
  return req.viewerKey;
});
