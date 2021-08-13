import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { knexConnectionProvider } from './knex-connection.provider';
import { KnexConnectionService } from './knex-connection.service';

@Module({
  imports: [ConfigModule.forRoot()],
  providers: [KnexConnectionService, ...knexConnectionProvider],
  exports: [KnexConnectionService, ...knexConnectionProvider],
})
export class KnexConnectionModule {}
