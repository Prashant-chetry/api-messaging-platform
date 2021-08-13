import { InternalServerErrorException } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { UserCreatedEvent } from 'src/users/events/imlps';
import { UsersRepository } from 'src/users/users.repository';
import { CreateUserCommand } from '../impls/create-user.command';

@CommandHandler(CreateUserCommand)
export class CreateUserCommandHandler
  implements ICommandHandler<CreateUserCommand>
{
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly eventBus: EventBus,
  ) {}
  async execute(command: CreateUserCommand) {
    const resp = await this.usersRepository.createUserWithKeycloak(
      command.createUser,
    );
    if (!resp) {
      throw new InternalServerErrorException('Failed to create user');
    }
    this.eventBus.publish(new UserCreatedEvent(resp.id));
    return resp;
  }
}
