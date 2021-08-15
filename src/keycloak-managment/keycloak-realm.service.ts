import {
  HttpService,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { existsSync, readFile, writeFile } from 'fs';
import * as jwksClient from 'jwks-rsa';
import { tmpdir } from 'os';
import { join } from 'path';
import { promisify } from 'util';
import { verify, VerifyOptions } from 'jsonwebtoken';

const writeFileAsync = promisify(writeFile);
const readFileAsync = promisify(readFile);
const jwtVerifyAsync = (
  token: string,
  secretOrPublicKey: any,
  options?: VerifyOptions,
) =>
  new Promise((resolve, reject) =>
    verify(token, secretOrPublicKey, options, (error, decoded) => {
      if (error) {
        return reject(error);
      }
      return resolve(decoded);
    }),
  );

@Injectable()
export class KeycloakRealmService {
  protected readonly keycloakHost: string;
  private readonly masterRealmClientId = 'admin-cli';
  private readonly masterRealmUsername: string;
  private readonly masterRealmPassword: string;
  private readonly _logger: Logger;
  constructor(
    protected readonly httpClient: HttpService,
    protected readonly configService: ConfigService,
  ) {
    this._logger = new Logger('KeycloakRealmService');
    this.keycloakHost = this.configService.get<string>('KEYCLOAK_HOST');
    this.masterRealmUsername = this.configService.get(
      'KEYCLOAK_MASTER_REALM_USERNAME',
    );
    this.masterRealmPassword = this.configService.get(
      'KEYCLOAK_MASTER_REALM_PASSWORD',
    );
  }

  /**
   * Method for creating realm pub key file
   */
  async retrieveAndCreateRealmPubCertsFile(name: string) {
    const client = jwksClient({
      jwksUri: `${this.keycloakHost}/auth/realms/${name}/protocol/openid-connect/certs`,
    });
    // * getting the RSA cert key
    const resp = await this.httpClient
      .get(
        `${this.keycloakHost}/auth/realms/${name}/protocol/openid-connect/certs`,
      )
      .toPromise();
    if (resp.status !== 200 || !resp.data?.keys) {
      Logger.error(
        `Error retrieveAndCreateRealmPubCertsFile method, error: ${JSON.stringify(
          resp,
        )}`,
      );
      throw new InternalServerErrorException();
    }
    const { x5c, kid } = resp.data?.keys?.pop();
    const publicKey: string = x5c.pop();
    if (!publicKey?.length || !kid.length) {
      Logger.error(
        'Error retrieveAndCreateRealmPubCertsFile method, error: rsa cert key or kid not found',
      );
      throw new InternalServerErrorException();
    }
    try {
      const pubKey = await client.getSigningKey(kid);
      const keycloakRealmTmpPath = join(
        tmpdir(),
        `keycloak-${name}.public.key`,
      );
      await writeFileAsync(keycloakRealmTmpPath, pubKey.getPublicKey());
      return true;
    } catch (error) {
      Logger.error(
        `Error retrieveAndCreateRealmPubCertsFile method, error: ${JSON.stringify(
          error,
        )}`,
      );
      throw new InternalServerErrorException();
    }
  }

  async getRealmPublicKey(name: string) {
    const realmPublicKeyPath = join(tmpdir(), `keycloak-${name}.public.key`);
    if (!global[`keycloak-${name}-public-key`]?.length) {
      if (!existsSync(realmPublicKeyPath)) {
        await this.retrieveAndCreateRealmPubCertsFile(name);
      }
      global[`keycloak-${name}-public-key`] = await readFileAsync(
        realmPublicKeyPath,
        {
          encoding: 'utf8',
        },
      ).catch((error) => {
        this._logger.error(
          `Error in getRealmPublicKey method, error: ${error}`,
        );
        throw new InternalServerErrorException();
      });
    }
    return global[`keycloak-${name}-public-key`];
  }

  /**
   * Method for getting access token of realm
   */
  async getRealmAccessToken(
    name: string,
    {
      username,
      password,
      client_id,
    }: {
      username?: string;
      password?: string;
      client_id: string;
      client_secret?: string;
    },
  ) {
    const currentTime = new Date().getTime();
    const accessTokenExpTime = new Date(
      global[`keycloak-${name}-token`]?.accessTokenExpiresIn,
    ).getTime();

    /**
     * if token doesn't exists in the global scope or token expires
     */
    if (
      !Object.keys(global[`keycloak-${name}-token`] || {}).length ||
      currentTime > accessTokenExpTime
    ) {
      let resp;
      try {
        const params = new URLSearchParams();
        params.append('client_id', client_id);
        params.append('username', username);
        params.append('password', password);
        params.append('grant_type', 'password');
        resp = await this.httpClient
          .post(
            `${this.keycloakHost}/auth/realms/${name}/protocol/openid-connect/token`,
            params,
            {
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
              },
            },
          )
          .toPromise();
      } catch (error) {
        this._logger.error(
          `Error in getRealmAccessToken method, error: ${JSON.stringify(
            error,
          )}`,
        );
        throw new InternalServerErrorException();
      }

      const realmPubCerts = await this.getRealmPublicKey(name);
      if (!realmPubCerts?.length) {
        throw new InternalServerErrorException();
      }
      try {
        await jwtVerifyAsync(resp.data.access_token, `${realmPubCerts}`, {
          algorithms: ['RS256'],
        });
      } catch (error) {
        this._logger.error(
          `Error in getRealmAccessToken method, error: ${JSON.stringify(
            error,
          )}`,
        );
        if (error.message === 'jwt expired') {
          throw new UnauthorizedException('Token expired');
        }
        throw new InternalServerErrorException();
      }
      global[`keycloak-${name}-token`] = {
        ...resp.data,
        accessTokenExpiresIn: new Date().setSeconds(resp.data.expires_in),
        refreshTokenExpiresIn: new Date().setSeconds(
          resp.data.refresh_expires_in,
        ),
      };
    }
    return global[`keycloak-${name}-token`];
  }

  /**
   * Method for getting master realm pub key from the file
   */
  async getMasterRealmPublicKey(): Promise<string> {
    return this.getRealmPublicKey('master');
  }

  /**
   * Method for getting access token of master realm
   */
  async getMasterRealmAccessToken() {
    return this.getRealmAccessToken('master', {
      username: this.masterRealmUsername,
      client_id: this.masterRealmClientId,
      password: this.masterRealmPassword,
    });
  }
}
