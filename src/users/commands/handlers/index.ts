import { CreateUserAndInKeycloakCommandHandler } from './create-user-keycloak.handler';
import { CreateUserUsingKeycloakIdCommandHandler } from './create-user.handler';
import { DeleteUserCommandHandler } from './delete-user.handler';
import { SentWelcomeMailToUserCommandHandler } from './sent-welcome-mail-user.handler';

export { CreateUserUsingKeycloakIdCommandHandler } from './create-user.handler';
export { SentWelcomeMailToUserCommandHandler } from './sent-welcome-mail-user.handler';
export { DeleteUserCommandHandler } from './delete-user.handler';

export const UserCommandHandlers = [
  CreateUserUsingKeycloakIdCommandHandler,
  DeleteUserCommandHandler,
  SentWelcomeMailToUserCommandHandler,
  CreateUserAndInKeycloakCommandHandler,
];
