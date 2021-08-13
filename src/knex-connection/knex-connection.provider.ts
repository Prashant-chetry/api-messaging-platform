import { KnexConnectionService } from './knex-connection.service';

export const KNEX_CONNECTION = 'KNEX_CONNECTION';
/**
 * provider for knex connection
 */
export const knexConnectionProvider = [
  {
    provide: KNEX_CONNECTION,
    useFactory: async (service: KnexConnectionService) => {
      return service.getKnex();
    },
    inject: [KnexConnectionService],
  },
];
