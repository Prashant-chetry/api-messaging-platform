import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../users.repository';
import { GetUserQuery } from '../imples/get-user.query';

@QueryHandler(GetUserQuery)
export class GetUserQueryHandler implements IQueryHandler<GetUserQuery> {
  constructor(private readonly usersRepository: UsersRepository) {}
  async execute(query: GetUserQuery) {
    return this.usersRepository.getUserById(query.id);
  }
}
