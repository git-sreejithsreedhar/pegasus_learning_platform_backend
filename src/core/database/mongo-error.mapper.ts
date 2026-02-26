import { DomainError } from '../common/errors/domain-error';
import { InfrastructureError } from '../common/errors/infrastructure.error';
import { ErrorCode } from '../common/errors/error-code.enum';

export interface MongoDuplicateKeyError {
  code: 11000;
  keyPattern: Record<string, number>;
  message?: string;
}

export class DuplicateKeyError extends DomainError {
  readonly code = ErrorCode.RESOURCE_ALREADY_EXISTS;

  constructor(field: string) {
    super(`${field} already exists`);
  }
}

export class MongoErrorMapper {
  static map(error: unknown): DomainError {
    // Duplicate key → business-level conflict
    if (this.isDuplicateKeyError(error)) {
      const field = Object.keys(error.keyPattern)[0] ?? 'field';
      return new DuplicateKeyError(field);
    }

    //Already mapped domain error → pass through
    if (error instanceof DomainError) {
      return error;
    }

    // Unknown DB error → infrastructure error
    return new InfrastructureError(
      ErrorCode.DATABASE_ERROR,
      'Database operation failed',
      {
        originalMessage: error instanceof Error ? error.message : String(error),
      },
    );
  }

  private static isDuplicateKeyError(
    error: unknown,
  ): error is MongoDuplicateKeyError {
    return (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      (error as { code?: unknown }).code === 11000 &&
      'keyPattern' in error &&
      typeof (error as { keyPattern?: unknown }).keyPattern === 'object'
    );
  }
}
