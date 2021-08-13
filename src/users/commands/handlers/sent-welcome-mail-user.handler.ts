import { isUUID } from 'class-validator';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SentWelcomeMailToUserCommand } from '../impls/sent-welcome-mail-user.command';
import { UsersRepository } from 'src/users/users.repository';
import { ConfigService } from '@nestjs/config';
import { sendEmail } from 'src/common/utils';

@CommandHandler(SentWelcomeMailToUserCommand)
export class SentWelcomeMailToUserCommandHandler
  implements ICommandHandler<SentWelcomeMailToUserCommand>
{
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly configService: ConfigService,
  ) {}
  async execute(command: SentWelcomeMailToUserCommand) {
    if (!isUUID(command.id)) return;
    const { data: userDoc } = await this.usersRepository.getUserById(
      command.id,
    );

    if (userDoc.welcome_mail_sent) return;
    const mailType = 'user_welcome_mail';
    await sendEmail(
      mailType,
      { to: [userDoc.email], from: '' },
      this.configService,
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
