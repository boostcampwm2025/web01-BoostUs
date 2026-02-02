import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentMember = createParamDecorator((_: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  return request.member?.id;
});
