import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from "../auth/roles.decorator";

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // get roles required for this route
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles || requiredRoles.length === 0) {
      // no roles required → allow access
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user; // extracted from JWT via AuthGuard

    if (!user || !user.role) {
      throw new ForbiddenException("User role missing");
    }

    // check if user.role matches required roles
    const hasRole = requiredRoles.includes(user.role);

    if (!hasRole) {
      throw new ForbiddenException(
        `Access denied: requires role ${requiredRoles.join(", ")}`,
      );
    }

    return true;
  }
}
