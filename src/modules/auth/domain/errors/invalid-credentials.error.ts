import { DomainError } from 'src/core/common/errors/domain-error';

export class InvalidCredentialsError extends DomainError {
  readonly code = 'INVALID_CREDENTIALS';

  constructor(mail: string) {
    super(`Invalid credentials email: ${mail}`);
  }
}
