import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { UsersRepository } from 'src/users/users.repository';
import { UserCreatedEvent } from '../imlps/user-created.event';

@EventsHandler(UserCreatedEvent)
export class UserCreatedEventHandler
  implements IEventHandler<UserCreatedEvent>
{
  constructor(private readonly userRepository: UsersRepository) {}
  async handle(event: UserCreatedEvent) {
    const user = await this.userRepository.getUserById(event.userId);
    console.log(user);
  }
}
