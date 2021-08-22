import { UserDeletedEventHandler } from './user-deleted.handler';
import { UserCreatedEventHandler } from './user-created.handler';

export { UserCreatedEventHandler } from './user-created.handler';
export { UserDeletedEventHandler } from './user-deleted.handler';

export const UserEventHandlers = [
  UserCreatedEventHandler,
  UserDeletedEventHandler,
];
