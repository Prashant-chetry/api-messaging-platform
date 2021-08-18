import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { UsersRepository } from 'src/users/users.repository';
import { UserCreatedEvent } from '../imlps/user-created.event';

@EventsHandler(UserCreatedEvent)
export class UserCreatedEventHandler
  implements IEventHandler<UserCreatedEvent>
{
  private readonly _logger: Logger;
  constructor(private readonly userRepository: UsersRepository) {
    this._logger = new Logger('UserCreatedEventHandler');
  }
  async handle(event: UserCreatedEvent) {
    const user = await this.userRepository.getUserById(event.userId);
    this._logger.log(user);
  }
}
