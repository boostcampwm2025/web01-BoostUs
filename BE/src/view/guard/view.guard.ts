import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request, Response } from 'express';
import { randomUUID } from 'crypto';

export interface RequestWithViewerKey extends Request {
  viewerKey: string;
}

@Injectable()
export class ViewerKeyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<RequestWithViewerKey>();
    const res = context.switchToHttp().getResponse<Response>();

    let viewerKey = req.cookies?.bid as string | undefined;

    if (!viewerKey) {
      viewerKey = randomUUID();
      res.cookie('bid', viewerKey, {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
      });
    }

    req.viewerKey = viewerKey;
    return true;
  }
}
