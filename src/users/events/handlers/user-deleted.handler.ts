import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { UserDeletedEvent } from '../imlps/user-deleted.event';

@EventsHandler(UserDeletedEvent)
export class UserDeletedEventHandler
  implements IEventHandler<UserDeletedEvent>
{
  private readonly _logger: Logger;
  constructor() {
    this._logger = new Logger('UserDeletedEventHandler');
  }
  handle(event: UserDeletedEvent): void | Promise<void> {
    this._logger.log(`user deleted by id: ${event.id}`);
  }
}
