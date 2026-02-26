import { DomainError } from 'src/core/common/errors/domain-error';

export abstract class TokenInvalidError extends DomainError {
  code = 'TOKEN_INVALID';

  constructor() {
    super('Invalid token');
  }
}
