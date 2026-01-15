import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class CustomerGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const path = req.url;

    // Public routes - no token needed
    if (path === '/customer/register' || path === '/customer/login') {
      return true;
    }

    // Get token from cookie instead of Authorization header
    const token = req.cookies?.access_token;

    if (!token) {
      throw new UnauthorizedException('No authentication token found');
    }

    try {
      const payload = this.jwtService.verify(token);

      if (payload.role !== 'customer') {
        throw new ForbiddenException('Access denied – customer only');
      }

      req.user = payload;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
