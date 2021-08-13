import { InternalServerErrorException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import sgMail from '@sendgrid/mail';

export type sentMailType = (
  type: string,
  {
    to,
    from,
  }: {
    to: string[];
    from: string;
  },
  configService: ConfigService,
) => Promise<boolean>;

/**
 * function for sending mail
 * @param param0
 * @param configService
 * @returns
 */
export const sendEmail: sentMailType = async (
  type: string,
  {
    to,
    from,
  }: {
    to: string[];
    from: string;
  },
  configService: ConfigService,
) => {
  sgMail.setApiKey(configService.get<string>('SENDGRID_API_KEY'));
  const msg = { to, from, subject: '', text: '', html: '' };
  try {
    await sgMail.send(msg);
    return true;
  } catch (error) {
    const logger = new Logger('sentEmail');
    logger.error(`error: ${error}`);
    throw new InternalServerErrorException('Failed to sent email');
  }
};

export const sendEmailProvider: { provide: string; useFactory: sentMailType } =
  {
    provide: 'SEND_EMAIL',
    useFactory: (
      type: string,
      {
        to,
        from,
      }: {
        to: string[];
        from: string;
      },
      configService: ConfigService,
    ) =>
      sendEmail(
        type,
        {
          to,
          from,
        },
        configService,
      ),
  };
