import {
  Post,
  Body,
  Controller,
  Delete,
  Param,
  Put,
  Get,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreatedResponseDTO } from 'src/common/dto';
import { CreateUserCommand } from './commands/impls/create-user.command';
import { DeleteUserCommand } from './commands/impls/delete-user.command';
import { CreateUserDTO } from './dto/create-user.dto';
import { GetUserQuery } from './queries/imples/get-user.query';

/**
 * Controller layer for user operation
 */
@Controller('v1/users')
export class UsersController {
  /**
   * initialization
   * @param commandBus initialization of commandBus
   */
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  async create(@Body() body: CreateUserDTO): Promise<CreatedResponseDTO> {
    return this.commandBus.execute(new CreateUserCommand(body));
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.commandBus.execute(new DeleteUserCommand(id));
  }

  @Get(':id')
  async getUser(@Param('id') id: string) {
    return this.queryBus.execute(new GetUserQuery(id));
  }
}
