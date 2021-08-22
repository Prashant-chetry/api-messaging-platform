import {
  Post,
  Body,
  Controller,
  Delete,
  Param,
  Get,
  BadRequestException,
  UseGuards,
  Request,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { isUUID } from 'class-validator';
import { CreatedResponseDTO, DeletedResponseDTO } from '../common/dto';
import { KeycloakAuthGuard } from '../common/utils/keycloak-auth.guard';
import { CreateUserAndInKeycloakCommand } from './commands/impls/create-user-keycloak.command';
import { CreateUserUsingKeycloakId } from './commands/impls/create-user.command';
import { DeleteUserCommand } from './commands/impls/delete-user.command';
import { CreateUserDTO } from './dto/create-user.dto';
import { GetUserQuery } from './queries/imples/get-user.query';
import { Request as ExpressRequest } from 'express';
import { UserDataDTO } from './dto/get-user.dto';
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

  @Post(':id/keycloak')
  async createUsingKeycloakId(@Param('id') keycloakId: string) {
    if (!isUUID(keycloakId)) {
      throw new BadRequestException('Invalid keycloak id');
    }

    return this.commandBus.execute(new CreateUserUsingKeycloakId(keycloakId));
  }

  @Post()
  async create(@Body() body: CreateUserDTO): Promise<CreatedResponseDTO> {
    return this.commandBus.execute(new CreateUserAndInKeycloakCommand(body));
  }

  @Delete(':id')
  @UseGuards(KeycloakAuthGuard)
  async delete(
    @Param('id') id: string,
    @Request() req: ExpressRequest,
  ): Promise<DeletedResponseDTO> {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid user');
    }
    const user: UserDataDTO = req['user'];
    return this.commandBus.execute(new DeleteUserCommand(id, user));
  }

  @Get(':id')
  @UseGuards(KeycloakAuthGuard)
  async getUser(@Param('id') id: string) {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid user');
    }

    return this.queryBus.execute(new GetUserQuery(id));
  }
}
