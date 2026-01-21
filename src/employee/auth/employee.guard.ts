import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class EmployeeGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    let token = request.headers.authorization?.split(' ')[1];
    if (!token && request.cookies && request.cookies.accessToken) {
      token = request.cookies.accessToken;
    }
    if (!token) {
      throw new HttpException('No token', HttpStatus.UNAUTHORIZED);
    }
    try {
      const payload = this.jwtService.verify(token);
      if (payload.role !== 'employee') {
        throw new HttpException(
          'Unauthorized: Not an employee',
          HttpStatus.FORBIDDEN,
        );
      }
      request.user = payload;
      return true;
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new HttpException('Token expired', HttpStatus.UNAUTHORIZED);
      }
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }
  }
}
