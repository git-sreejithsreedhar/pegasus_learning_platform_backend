import { HttpException, Inject, Injectable } from '@nestjs/common';
import { IMailService } from './mail.interface';
import { ConfigService } from '@nestjs/config';
import { Logger } from 'winston';
import type { Transporter } from 'nodemailer';
import { ResponseConstants } from '../constants/response.constants';

@Injectable()
export class MailService implements IMailService {
  appName: string;
  constructor(
    @Inject('MAIL_TRANSPORTER')
    private readonly transporter: Transporter,
    @Inject('winston') private readonly logger: Logger,
    private readonly configService: ConfigService,
  ) {
    this.appName = this.configService.get<string>('app.mail.appName') || 'App';
  }

  // send verification mail
  async sendVerificationMail(
    to: string,
    link: string,
    name: string,
  ): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: this.appName,
        to: to,
        subject: 'Verify your email',
        html: `
            <h1>Hello ${name},</h1>
            <p>Thank you for signing up!</p>
            
             <p>${link}</p>
            `,
      });
    } catch (error) {
      this.logger.error('Failed to send verification mail', {
        error: error instanceof Error ? error.message : error,
      });

      throw new HttpException(
        ResponseConstants.MAIL_SEND_FAILED.message,
        ResponseConstants.MAIL_SEND_FAILED.statusCode,
      );
    }
  }

  // send password reset mail
  async sendPasswordReset(to: string, resetLink: string): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: this.appName,
        to: to,
        subject: 'Reset Your Password',
        html: `
                <h1>Password Reset</h1>
                <p>Your password reset code is:</p>
                <h2>${resetLink}</h2>
            `,
      });
    } catch (error) {
      this.logger.error('Failed to send verification mail', {
        error: error instanceof Error ? error.message : error,
      });

      throw new HttpException(
        ResponseConstants.MAIL_SEND_FAILED.message,
        ResponseConstants.MAIL_SEND_FAILED.statusCode,
      );
    }
  }
}
