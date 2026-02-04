import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/** AuthGuard에서 주입하는 멤버 정보 (request.member) */
interface RequestWithMember {
  member?: { id: string };
}

// 데코레이터 이름은 @CurrentMember() 사용을 위해 PascalCase 유지
// eslint-disable-next-line @typescript-eslint/naming-convention -- decorator API
export const CurrentMember = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): bigint | undefined => {
    const request = ctx.switchToHttp().getRequest<RequestWithMember>();
    if (!request.member?.id) return undefined;
    return BigInt(request.member.id);
  },
);
