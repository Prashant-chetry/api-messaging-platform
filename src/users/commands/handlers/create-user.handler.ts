import { BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { isUUID } from 'class-validator';
import { CreatedResponseDTO } from 'src/common/dto';
import { KeycloakUserService } from '../../../keycloak-managment/keycloak-user.service';
import { UserCreatedEvent } from '../../events/imlps';
import { UsersRepository } from '../../users.repository';
import { CreateUserUsingKeycloakId } from '../impls/create-user.command';

@CommandHandler(CreateUserUsingKeycloakId)
export class CreateUserUsingKeycloakIdCommandHandler
  implements ICommandHandler<CreateUserUsingKeycloakId>
{
  private readonly _realm: string;

  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly eventBus: EventBus,
    private readonly keycloakUserService: KeycloakUserService,
    private readonly configService: ConfigService,
  ) {
    this._realm = this.configService.get<string>('KEYCLOAK_REALM_NAME');
  }
  async execute(
    command: CreateUserUsingKeycloakId,
  ): Promise<CreatedResponseDTO> {
    if (!isUUID(command.keycloakId)) {
      throw new BadRequestException('Invalid keycloak id');
    }
    const keycloakUserInfo = await this.keycloakUserService.getUserById(
      this._realm,
      command.keycloakId,
    );
    const resp = await this.usersRepository.createWithKeycloakId(
      {
        email: keycloakUserInfo.email,
        firstName: keycloakUserInfo.firstName,
        lastName: keycloakUserInfo.lastName,
      },
      keycloakUserInfo.id,
    );
    this.eventBus.publish(new UserCreatedEvent(resp.id));
    return resp;
  }
}
