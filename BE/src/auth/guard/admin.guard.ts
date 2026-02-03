import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { Role } from '../../generated/prisma/enums';
import { AdminRequiredException } from '../exception/auth.exception';

interface RequestWithMember extends Request {
  member?: { id: string; role: Role };
}

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<RequestWithMember>();
    const member = request.member;

    if (!member || member.role !== Role.ADMIN) {
      throw new AdminRequiredException();
    }

    return true;
  }
}
