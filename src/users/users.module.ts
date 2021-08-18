import { KnexConnectionModule } from './../knex-connection/knex-connection.module';
import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersRepository } from './users.repository';
import { UserCommandHandlers } from './commands/handlers';
import { UserEventHandlers } from './events/handlers';
import { CqrsModule } from '@nestjs/cqrs';
import { ConfigModule } from '@nestjs/config';
import { configuration } from 'src/configuration';
import { KeycloakManagementModule } from 'src/keycloak-managment/keycloak-management.module';
import { UserSagas } from './sages/user.sage';
import { UserQueryHandlers } from './queries/handlers';

@Module({
  imports: [
    KnexConnectionModule,
    CqrsModule,
    ConfigModule.forRoot({ load: [configuration] }),
    KeycloakManagementModule,
  ],
  controllers: [UsersController],
  providers: [
    UsersRepository,
    ...UserCommandHandlers,
    ...UserEventHandlers,
    ...UserQueryHandlers,
    UserSagas,
  ],
})
export class UsersModule {}
