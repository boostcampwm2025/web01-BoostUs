import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { Role } from '../../generated/prisma/enums';
import { IS_ADMIN_KEY } from '../decorator/admin.decorator';
import { AdminRequiredException } from '../exception/auth.exception';

interface RequestWithMember extends Request {
  member?: { id: string; role: Role };
}

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isAdmin = this.reflector.getAllAndOverride<boolean>(IS_ADMIN_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!isAdmin) {
      return true;
    }

    const request = context.switchToHttp().getRequest<RequestWithMember>();
    const member = request.member;

    if (!member || member.role !== Role.ADMIN) {
      throw new AdminRequiredException();
    }

    return true;
  }
}
