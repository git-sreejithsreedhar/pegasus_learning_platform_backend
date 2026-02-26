import { DomainError } from './domain-error';

export class DuplicateKeyError extends DomainError {
  readonly code = 'DUPLICATE_KEY';

  constructor(field: string) {
    super(`${field} already exists`);
  }
}
