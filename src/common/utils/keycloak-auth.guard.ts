import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { KeycloakUserService } from 'src/keycloak-managment/keycloak-user.service';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class KeycloakAuthGuard implements CanActivate {
  private readonly _realm: string;

  constructor(
    private readonly keycloakUserService: KeycloakUserService,
    private readonly configService: ConfigService,
  ) {
    this._realm = this.configService.get<string>('KEYCLOAK_REALM_NAME');
  }
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const authHeader = request.header('Authentication');
    const [type, accessToken] = authHeader.split(' ');
    if (!type || type !== 'Bearer') {
      throw new UnauthorizedException('Unauthorized');
    }
    if (!accessToken?.length) {
      throw new UnauthorizedException('Unauthorized');
    }

    const decoded = this.keycloakUserService.verifyToken(
      this._realm,
      accessToken,
    );
    return true;
  }
}
