import { IEvent } from '@nestjs/cqrs';

/**
 * Event for user delete
 */
export class UserDeletedEvent implements IEvent {
  constructor(public readonly id: string, public readonly by: string) {}
}
