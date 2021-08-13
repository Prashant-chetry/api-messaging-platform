import { KnexConnectionModule } from './../knex-connection/knex-connection.module';
import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersRepository } from './users.repository';
import { UserCommandHandlers } from './commands/handlers';
import { UserEventHandlers } from './events/handlers';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  imports: [KnexConnectionModule, CqrsModule],
  controllers: [UsersController],
  providers: [UsersRepository, ...UserCommandHandlers, ...UserEventHandlers],
})
export class UsersModule {}
