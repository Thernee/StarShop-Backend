import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { verify } from 'jsonwebtoken';

declare module 'express' {
  export interface Request {
    user?: { id: string };
  }
}

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Authorization token missing or invalid');
    }

    const token = authHeader.split(' ')[1];

    try {
      const decoded = verify(token, process.env.JWT_SECRET) as { id: string };
      request.user = { id: decoded.id };
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
