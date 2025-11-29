import {Injectable, CanActivate, ExecutionContext, UnauthorizedException} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtAuthGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const authHeader = request.headers['authorization'];

        if (!authHeader) {
            throw new UnauthorizedException('No authorization header missing');
        }
        const [type, token] = authHeader.split(' ');

        if (type !== 'Bearer' || !token) {
            throw new UnauthorizedException('Invalid authorization format');
        }

        try {
                const decoded = jwt.verify(
                    token, process.env.JWT_SECRET || 'secret123',);

                request.user = decoded;
                return true;
            }
        catch (err) 
        {
            throw new UnauthorizedException('Invalid or expired Token');
        }
    }
}   
            