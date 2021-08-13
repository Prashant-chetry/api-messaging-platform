import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Knex } from 'knex';

/**
 * Service layer for knex connection
 */
@Injectable()
export class KnexConnectionService {
  private readonly _logger: Logger;
  private _knexConnection: Knex;
  constructor(private readonly configService: ConfigService) {
    this._logger = new Logger('KnexConnectionService');
  }
  /**
   * Method for getting knex connection
   * @returns
   */
  getKnex() {
    const database = this.configService.get<string>('DATABASE_NAME');
    const dbUser = this.configService.get<string>('DATABASE_USER');
    const dbPassword = this.configService.get<string>('DATABASE_PASSWORD');
    console.log(dbPassword, dbUser);
    if (!this._knexConnection) {
      this._knexConnection = require('knex')({
        client: 'postgresql',
        connection: {
          database,
          user: dbUser,
          password: dbPassword,
        },
        pool: {
          min: 2,
          max: 10,
        },
        migrations: {
          tableName: 'knex_migrations',
        },
      });
      this._logger.log(`knex connection created`);
    }
    return this._knexConnection;
  }
}
