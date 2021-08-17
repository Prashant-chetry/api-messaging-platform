import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Knex } from 'knex';
const knexConfig = require('../../knexfile');
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
    const environment = this.configService.get<string>('DB_ENV');
    console.log(knexConfig[environment]);
    if (!this._knexConnection) {
      this._knexConnection = require('knex')(knexConfig[environment]);
      this._logger.log(`knex connection created`);
    }
    return this._knexConnection;
  }
}
