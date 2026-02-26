import { Logger } from 'winston';
import { AppException } from '../errors/app-exceptions';
import { ErrorCode } from '../errors/error-code.enum';
import {
  InvalidIdFormatException,
  DatabaseException,
  ValidationException,
} from '../errors/app-exceptions';
import { isValidObjectId } from 'mongoose';

/**
 * Centralized error handling utilities
 */

/**
 * Validates MongoDB ObjectId and throws InvalidIdFormatException if invalid
 */
export function validateMongoId(id: string, fieldName = 'ID'): void {
  if (!isValidObjectId(id)) {
    throw new InvalidIdFormatException(`Invalid ${fieldName} format`);
  }
}

/**
 * Handles errors from async operations with structured logging
 */
export async function handleAsyncError<T>(
  operation: () => Promise<T>,
  logger: Logger,
  context: string,
  errorHandler?: (error: unknown) => AppException,
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    logger.error(`${context} failed`, {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });

    if (errorHandler) {
      throw errorHandler(error);
    }

    if (error instanceof AppException) {
      throw error;
    }

    throw new Error(`${context} failed`);
  }
}

/**
 * Converts unknown database errors to DatabaseException
 */
export function handleDatabaseError(
  error: unknown,
  operation = 'Database operation',
): DatabaseException {
  const message = error instanceof Error ? error.message : String(error);

  if (message.includes('duplicate')) {
    return new DatabaseException(`${operation} failed: Duplicate entry`, {
      reason: 'DUPLICATE_KEY',
    });
  }

  if (message.includes('validation')) {
    return new DatabaseException(`${operation} failed: Invalid data`, {
      reason: 'VALIDATION_FAILED',
    });
  }

  return new DatabaseException(`${operation} failed: ${message}`, {
    originalError: message,
  });
}

/**
 * Safe error message for client response (doesn't leak internal details)
 */
export function getSafeErrorMessage(error: unknown): string {
  if (error instanceof AppException) {
    return error.message;
  }

  if (error instanceof Error) {
    // Check for specific error patterns
    if (error.message.includes('authentication')) {
      return 'Authentication failed';
    }
    if (error.message.includes('permission')) {
      return 'Permission denied';
    }
    if (error.message.includes('not found')) {
      return 'Resource not found';
    }
  }

  return 'An error occurred';
}

/**
 * Logs structured error information for debugging
 */
export function logStructuredError(
  logger: Logger,
  error: unknown,
  context: {
    operation: string;
    userId?: string;
    resource?: string;
    [key: string]: unknown;
  },
): void {
  const { operation, ...otherContext } = context;
  const errorInfo = {
    operation,
    ...otherContext,
  };

  if (error instanceof AppException) {
    logger.warn(`[AppError] ${error.code} - ${error.message}`, {
      ...errorInfo,
      code: error.code,
      statusCode: error.statusCode,
      details: error.details,
    });
  } else if (error instanceof Error) {
    logger.error(`[Error] ${error.message}`, {
      ...errorInfo,
      stack: error.stack,
    });
  } else {
    logger.error('[UnknownError]', {
      ...errorInfo,
      error: String(error),
    });
  }
}

/**
 * Extracts error code from exception or returns default
 */
export function getErrorCode(
  error: unknown,
  defaultCode = ErrorCode.INTERNAL_SERVER_ERROR,
): ErrorCode {
  if (error instanceof AppException) {
    return error.code;
  }
  return defaultCode;
}

/**
 * Validates required fields and throws ValidationException if missing
 */
export function validateRequiredFields(
  data: Record<string, unknown>,
  requiredFields: string[],
): void {
  const missingFields = requiredFields.filter((field) => !data[field]);

  if (missingFields.length > 0) {
    throw new ValidationException('Missing required fields', {
      missingFields,
    });
  }
}
