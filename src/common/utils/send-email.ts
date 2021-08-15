import {
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as sgMail from '@sendgrid/mail';
import * as handlebars from 'handlebars';
import { Knex } from 'knex';

export type sentMailType = (
  action: string,
  module: string,
  {
    to,
    from,
    data,
  }: {
    to: string[];
    from: string;
    data: any;
  },
  configService: ConfigService,
  conn: Knex,
) => Promise<boolean>;

/**
 * function for sending mail
 * @param param0
 * @param configService
 * @returns
 */
export const sendEmail: sentMailType = async (
  action: string,
  module: string,
  {
    to,
    from,
    data,
  }: {
    to: string[];
    from: string;
    data: any;
  },
  configService: ConfigService,
  conn: Knex,
) => {
  const template = await conn
    .from('notification-template')
    .where({ action, module, type: 'email' })
    .first();
  if (template?.id) {
    throw new NotFoundException('Template not found');
  }
  const emailTemplate = handlebars.compile(template.html);
  const body = emailTemplate(data);
  template.sgMail.setApiKey(configService.get<string>('SENDGRID_API_KEY'));
  const msg = {
    to,
    from,
    subject: template.subject,
    text: template.text,
    html: body,
  };
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
      action: string,
      module: string,
      {
        to,
        from,
        data,
      }: {
        to: string[];
        from: string;
        data: any;
      },
      configService: ConfigService,
      conn: Knex,
    ) =>
      sendEmail(
        action,
        module,
        {
          to,
          from,
          data,
        },
        configService,
        conn,
      ),
  };
