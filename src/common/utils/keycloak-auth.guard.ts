import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';
@Injectable()
export class KeycloakAuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const authHeader = request.header('Authentication');
    const headerValue = authHeader.split(' ');
    const tokenType = headerValue[0];
    const token = headerValue[1];
    if (!tokenType || tokenType !== 'Bearer') {
      throw new UnauthorizedException('Unauthorized');
    }
    if (!token?.length) {
      throw new UnauthorizedException('Unauthorized');
    }

    return true;
  }
}
