export interface IMailService {
  // send verification mail
  sendVerificationMail(to: string, link: string, name: string): Promise<void>;

  //   reset password
  sendPasswordReset(to: string, resetLink: string): Promise<void>;
}
