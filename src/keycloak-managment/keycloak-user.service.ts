import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  HttpService,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { isJWT, isString, isUUID } from 'class-validator';
import { GetPublicKeyOrSecret, verify, VerifyOptions } from 'jsonwebtoken';
import { KeycloakTokenDecoded } from '../common/dto/index';
import { CreateKeycloakUserDTO } from './dto/create-user-keycloak.dto';
import { GetKeycloakUserDTO } from './dto/get-user.dto';
import { KeycloakRealmService } from './keycloak-realm.service';

const jwtVerifyAsync = (
  token: string,
  secretOrPublicKey:
    | string
    | Buffer
    | { key: string | Buffer; passphrase: string }
    | GetPublicKeyOrSecret,
  options?: VerifyOptions,
): Promise<KeycloakTokenDecoded> =>
  new Promise((resolve, reject) =>
    verify(
      token,
      secretOrPublicKey,
      options,
      (error, decoded: KeycloakTokenDecoded) => {
        if (error) {
          return reject(error);
        }
        return resolve(decoded);
      },
    ),
  );

@Injectable()
export class KeycloakUserService extends KeycloakRealmService {
  private readonly logger: Logger;
  constructor(
    public readonly httpClient: HttpService,
    public readonly configService: ConfigService,
  ) {
    super(httpClient, configService);
    this.logger = new Logger('KeycloakUserService');
  }
  async createUser(
    realm: string,
    {
      username,
      firstName,
      lastName,
      password,
      temporary,
    }: CreateKeycloakUserDTO,
  ) {
    if (!realm.length || !username.length || !password.length) {
      throw new ForbiddenException();
    }
    const token = await super.getMasterRealmAccessToken();
    if (!token.access_token?.length) {
      this.logger.log(`token expired`);
      throw new UnauthorizedException('Token expired');
    }

    const payload: {
      username: string;
      email: string;
      firstName: string;
      lastName: string;
      credentials: { type: string; value: string; temporary: boolean }[];
      enabled: boolean;
    } = {
      firstName,
      lastName,
      username,
      email: username,
      credentials: [{ type: 'password', value: password, temporary }],
      enabled: true,
    };

    return this.httpClient
      .post(`${this.keycloakHost}/auth/admin/realms/${realm}/users`, payload, {
        headers: { Authorization: `bearer ${token.access_token}` },
      })
      .toPromise()
      .catch((error) => {
        this.logger.error(
          `Error in createUser method, error: ${JSON.stringify(error)}`,
        );
        if (error.message === 'Request failed with status code 401') {
          throw new UnauthorizedException();
        }
        if (error.message === 'Request failed with status code 409') {
          throw new ConflictException(
            `User already exists with mobile number: ${username}`,
          );
        }
        throw new InternalServerErrorException();
      });
  }

  /**
   *
   * Method for verifying keycloak user token of a realm
   */
  async verifyToken(
    token: string,
    realm: string,
  ): Promise<KeycloakTokenDecoded> {
    if (!isJWT(token) || !isString(realm) || !realm?.length) {
      throw new UnauthorizedException('Invalid token or realm');
    }
    const realmPubCerts = await super.getRealmPublicKey(realm);
    if (!realmPubCerts?.length) {
      throw new InternalServerErrorException();
    }
    try {
      return await jwtVerifyAsync(token, `${realmPubCerts}`, {
        algorithms: ['RS256'],
      });
    } catch (error) {
      this.logger.error(
        `Error in getRealmAccessToken method, error: ${JSON.stringify(error)}`,
      );
      if (error.message === 'jwt expired') {
        throw new UnauthorizedException('Token expired');
      }
      throw new InternalServerErrorException();
    }
  }

  /**
   * Method for getting keycloak user list
   * @param realm realm name
   * @param param1
   * @returns
   */
  async getUserList(
    realm: string,
    { username, email }: { username?: string; email?: string },
  ) {
    const token = await super.getMasterRealmAccessToken();
    if (!token.access_token?.length) {
      throw new UnauthorizedException('Token expired');
    }
    const params = new URLSearchParams();
    if (username?.length) {
      params.append('username', username);
    }
    if (!username?.length && email?.length) {
      params.append('username', email);
    }

    try {
      const resp = await this.httpClient
        .get(`${this.keycloakHost}/auth/admin/realms/${realm}/users/`, {
          params,
          headers: {
            Authorization: `bearer ${token.access_token}`,
          },
        })
        .toPromise();
      return resp.data;
    } catch (error) {
      Logger.error(
        `Error in KeycloakUserService getUserList method, error: ${JSON.stringify(
          error,
        )}`,
      );
      if (error.message === 'Request failed with status code 401') {
        throw new UnauthorizedException();
      }
      throw new InternalServerErrorException();
    }
  }

  /**
   *
   * Method for getting keycloak user by id
   */
  async getUserById(
    realm: string,
    userId: string,
  ): Promise<GetKeycloakUserDTO> {
    if (!isUUID(userId) || !isString(realm) || !realm.length) {
      throw new BadRequestException();
    }
    const token = await super.getMasterRealmAccessToken();
    if (!token.access_token?.length) {
      throw new UnauthorizedException('Token expired');
    }

    try {
      const resp = await this.httpClient
        .get(
          `${this.keycloakHost}/auth/admin/realms/${realm}/users/${userId}`,
          {
            headers: {
              Authorization: `bearer ${token.access_token}`,
            },
          },
        )
        .toPromise();
      return resp.data;
    } catch (error) {
      Logger.error(
        `Error in KeycloakUserService getUserById method, error: ${JSON.stringify(
          error,
        )}`,
      );
      if (error.message === 'Request failed with status code 401') {
        throw new UnauthorizedException();
      }
      if (error.message === 'Request failed with status code 404') {
        throw new NotFoundException(`not found user with name ${userId}`);
      }
      throw new InternalServerErrorException();
    }
  }
}
