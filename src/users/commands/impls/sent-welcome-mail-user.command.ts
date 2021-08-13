import { ICommand } from '@nestjs/cqrs';
export class SentWelcomeMailToUserCommand implements ICommand {
  constructor(public readonly id: string) {}
}
