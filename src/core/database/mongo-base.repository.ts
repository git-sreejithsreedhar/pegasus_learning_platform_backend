import { Logger } from 'winston';
import { MongoErrorMapper } from './mongo-error.mapper';
import { InfrastructureError } from '../common/errors/infrastructure.error';
import { DomainError } from '../common/errors/domain-error';
import { ErrorCode } from '../common/errors/error-code.enum';

export abstract class BaseRepository {
  protected abstract logger: Logger;

  protected async execute<T>(operation: () => Promise<T>): Promise<T> {
    try {
      return await operation();
    } catch (error: unknown) {
      const mappedError = MongoErrorMapper.map(error);

      this.logger.error('Mongo error', {
        originalMessage: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        mappedError: mappedError.constructor.name,
      });

      // If it’s already a DomainError → safe to throw
      if (mappedError instanceof DomainError) {
        throw mappedError;
      }

      //  Everything else becomes InfrastructureError
      throw new InfrastructureError(
        ErrorCode.DATABASE_ERROR,
        'Database operation failed',
      );
    }
  }
}
