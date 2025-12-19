import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { IMailServiceToken } from './mail.constant';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { createMailTransporter } from './mail.config';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'MAIL_TRANSPORTER',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        // MUST return the transporter
        return createMailTransporter(configService);
      },
    },
    {
      provide: IMailServiceToken,
      useClass: MailService,
    },
  ],
  exports: [IMailServiceToken],
})
export class MailModule {}
