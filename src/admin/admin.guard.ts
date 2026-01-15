import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(" ")[1];
    if (!token) {
      throw new HttpException("No token", HttpStatus.UNAUTHORIZED);
    }
    try {
      const payload = this.jwtService.verify(token);
      if (payload.role !== "admin") {
        throw new HttpException(
          "Unauthorized: Not an admin",
          HttpStatus.FORBIDDEN,
        );
      }
      request.user = payload;
      return true;
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        throw new HttpException("Token expired", HttpStatus.UNAUTHORIZED);
      }
      throw new HttpException("Invalid token", HttpStatus.UNAUTHORIZED);
    }
  }
}
