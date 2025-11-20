// import nodemailer from 'nodemailer';
// import { configService as ConfigService } from '@nestjs/config';

// export const createMailTransporter = (): Transporter => {
//   const user = configService.get<string>('app.mail.user');
//   const password = this.configService.get<string>('app.mail.password');
//   const host = this.configService.get<string>('app.mail.host');
//   const port = this.configService.get<string>('app.mail.port') || '587';

//   this.appName = this.configService.get<string>('app.mail.appName');

//   return nodemailer.createTransport({
//     host: host,
//     port: parseInt(port),
//     secure: parseInt(port) === 465,
//     auth: {
//       user: user,
//       pass: password,
//     },
//   });
// };
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';
import { ConfigService } from '@nestjs/config';

export const createMailTransporter = (
  configService: ConfigService,
): Transporter => {
  const user = configService.get<string>('app.mail.user');
  const password = configService.get<string>('app.mail.password');
  const host = configService.get<string>('app.mail.host');
  const port = configService.get<string>('app.mail.port') || '587';

  return nodemailer.createTransport({
    host: host,
    port: parseInt(port),
    secure: parseInt(port) === 465,
    auth: {
      user: user,
      pass: password,
    },
  });
};
