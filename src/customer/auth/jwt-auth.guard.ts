// src/auth/jwt-auth.guard.ts
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];

    if (!authHeader) {
      throw new UnauthorizedException('No authorization header');
    }

    const token = authHeader.split(' ')[1]; // "Bearer <token>"

    if (!token) {
      throw new UnauthorizedException('Token not found');
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret123');
      request.user = decoded; // set user data
      return true;
    } catch (e) {
      throw new UnauthorizedException('Invalid Token');
    }
  }
}
