import { ICommand } from '@nestjs/cqrs';
export class CreateUserUsingKeycloakId implements ICommand {
  constructor(public readonly keycloakId: string) {}
}
