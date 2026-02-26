import { DomainError } from 'src/core/common/errors/domain-error';

export class TokenExpiredError extends DomainError {
  readonly code = 'TOKEN_EXPIRED';

  constructor() {
    super('Token has expired');
  }
}
