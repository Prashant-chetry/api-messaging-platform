import { InternalServerErrorException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { isUUID } from 'class-validator';
import { randomInt } from 'crypto';
import { KeycloakUserService } from 'src/keycloak-managment/keycloak-user.service';
import { UserCreatedEvent } from 'src/users/events/imlps';
import { UsersRepository } from 'src/users/users.repository';
import { CreateUserAndInKeycloakCommand } from '../impls/create-user-keycloak.command';

@CommandHandler(CreateUserAndInKeycloakCommand)
export class CreateUserAndInKeycloakCommandHandler
  implements ICommandHandler<CreateUserAndInKeycloakCommand>
{
  private readonly _realm: string;
  private readonly _logger: Logger;

  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly eventBus: EventBus,
    private readonly keycloakUserService: KeycloakUserService,
    private readonly configService: ConfigService,
  ) {
    this._realm = this.configService.get<string>('KEYCLOAK_REALM_NAME');
    this._logger = new Logger('CreateUserAndInKeycloakCommandHandler');
  }
  async execute(command: CreateUserAndInKeycloakCommand) {
    const tempPassword = randomInt(10000, 99999).toString();
    /**
     * * create account in keycloak
     */
    await this.keycloakUserService.createUser(this._realm, {
      firstName: command.createUser.firstName,
      lastName: command.createUser.lastName,
      username: command.createUser.email,
      password: tempPassword,
      temporary: true,
    });
    const keycloakResp = await this.keycloakUserService.getUserList(
      this._realm,
      {
        username: command.createUser.email,
      },
    );
    if (!Array.isArray(keycloakResp) && !keycloakResp.length) {
      throw new InternalServerErrorException();
    }
    const data = keycloakResp.pop();
    const keycloakId = data?.id;
    if (!isUUID(keycloakId)) {
      this._logger.error(
        'Error in CreateUserAndInKeycloakCommandHandler, error: user not found in keycloak',
      );
      throw new InternalServerErrorException();
    }
    const resp = await this.usersRepository.createWithKeycloakId(
      command.createUser,
      keycloakId,
    );
    if (!resp) {
      throw new InternalServerErrorException('Failed to create user');
    }
    this.eventBus.publish(new UserCreatedEvent(resp.id));
    return resp;
  }
}
