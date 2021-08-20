import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { KeycloakUserService } from '../../keycloak-managment/keycloak-user.service';
import { ConfigService } from '@nestjs/config';
import { UsersRepository } from '../../users/users.repository';
import { isUUID } from 'class-validator';

/**
 * Guard for doing keycloak validation
 */
@Injectable()
export class KeycloakAuthGuard implements CanActivate {
  private readonly _realm: string;
  private readonly _logger: Logger;

  /**
   * initialization
   * @param keycloakUserService initialization keycloak user service
   * @param configService initialization config service
   * @param userService initialization user service
   */
  constructor(
    private readonly keycloakUserService: KeycloakUserService,
    private readonly configService: ConfigService,
    private readonly userService: UsersRepository,
  ) {
    this._realm = this.configService.get<string>('KEYCLOAK_REALM_NAME');
    this._logger = new Logger('KeycloakAuthGuard');
  }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const authHeader = request.header('Authentication');
    const [type, accessToken] = authHeader.split(' ');
    if (!type || type !== 'Bearer') {
      throw new UnauthorizedException('Failed to authenticate');
    }
    if (!accessToken?.length) {
      throw new UnauthorizedException('Failed to authenticate');
    }

    try {
      /**
       * decoding the token with the proper realm
       */
      const decoded = await this.keycloakUserService.verifyToken(
        accessToken,
        this._realm,
      );
      if (!decoded.sub || !isUUID(decoded.sub)) {
        throw new UnauthorizedException('Invalid user');
      }

      const user = await this.userService.getUserByKeycloakId(decoded.sub);
      request['user'] = user.data;
      return true;
    } catch (error) {
      this._logger.log(`error, ${error}`);
      throw new UnauthorizedException('Failed to authenticate');
    }
  }
}
