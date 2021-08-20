import { ICommand } from '@nestjs/cqrs';
import { CreateUserDTO } from '../../dto/create-user.dto';

export class CreateUserAndInKeycloakCommand implements ICommand {
  constructor(public readonly createUser: CreateUserDTO) {}
}
