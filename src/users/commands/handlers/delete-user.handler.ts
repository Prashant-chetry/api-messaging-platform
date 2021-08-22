import { UserDeletedEvent } from './../../events/imlps/user-deleted.event';
import { BadRequestException } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { isUUID } from 'class-validator';
import { UsersRepository } from '../../users.repository';
import { DeleteUserCommand } from '../impls/delete-user.command';

@CommandHandler(DeleteUserCommand)
export class DeleteUserCommandHandler
  implements ICommandHandler<DeleteUserCommand>
{
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly eventBus: EventBus,
  ) {}
  async execute(command: DeleteUserCommand) {
    if (!isUUID(command.id)) {
      throw new BadRequestException('Invalid user');
    }
    const resp = await this.usersRepository.deleteUser(command.id);
    this.eventBus.publish(new UserDeletedEvent(command.id, command.by.id));
    return resp;
  }
}
