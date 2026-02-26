import { DomainError } from './domain-error';
import { ErrorCode } from './error-code.enum';

export class ResourceNotFoundError extends DomainError {
  readonly code = ErrorCode.RESOURCE_NOT_FOUND;

  constructor(resource: string) {
    super(`${resource} not found`);
  }
}
