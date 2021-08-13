import { CreateUserCommandHandler } from './create-user.handler';
import { DeleteUserCommandHandler } from './delete-user.handler';
import { SentWelcomeMailToUserCommandHandler } from './sent-welcome-mail-user.handler';

export { CreateUserCommandHandler } from './create-user.handler';
export { SentWelcomeMailToUserCommandHandler } from './sent-welcome-mail-user.handler';
export { DeleteUserCommandHandler } from './delete-user.handler';

export const UserCommandHandlers = [
  CreateUserCommandHandler,
  DeleteUserCommandHandler,
  SentWelcomeMailToUserCommandHandler,
];
