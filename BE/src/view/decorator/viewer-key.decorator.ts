import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { RequestWithViewerKey } from '../guard/view.guard';

export const ViewerKey = createParamDecorator((_: unknown, ctx: ExecutionContext): string => {
  const req = ctx.switchToHttp().getRequest<RequestWithViewerKey>();
  return req.viewerKey;
});
