import { isUUID } from 'class-validator';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SentWelcomeMailToUserCommand } from '../impls/sent-welcome-mail-user.command';
import { UsersRepository } from 'src/users/users.repository';
import { ConfigService } from '@nestjs/config';
import { sendEmail } from 'src/common/utils';
import { Knex } from 'knex';
import { KNEX_CONNECTION } from 'src/knex-connection/knex-connection.provider';
import { Inject } from '@nestjs/common';

@CommandHandler(SentWelcomeMailToUserCommand)
export class SentWelcomeMailToUserCommandHandler
  implements ICommandHandler<SentWelcomeMailToUserCommand>
{
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly configService: ConfigService,
    @Inject(KNEX_CONNECTION) private conn: Knex,
  ) {}
  async execute(command: SentWelcomeMailToUserCommand) {
    if (!isUUID(command.id)) return;
    const { data: userDoc } = await this.usersRepository.getUserById(
      command.id,
      ['id', 'email', 'first_name', 'last_name'],
    );

    if (userDoc.welcome_mail_sent) return;
    const action = 'user_welcome_mail';
    await sendEmail(
      action,
      'users',
      {
        to: [userDoc.email],
        from: this.configService.get<string>('SENDGRID_SENDER'),
      },
      this.configService,
      this.conn,
    );
    return this.usersRepository.updateUser(
      command.id,
      {
        welcome_mail_sent: true,
      },
      command.id,
    );
  }
}
