import { DomainError } from 'src/core/common/errors/domain-error';

export class EmailNotVerifiedError extends DomainError {
  code: 'EMAIL_NOT_VERIFIED';
  constructor(email: string) {
    super(`Your email address ${email} has not been verified.`);
  }
}
