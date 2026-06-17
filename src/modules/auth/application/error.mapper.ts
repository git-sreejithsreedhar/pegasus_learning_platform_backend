import { HttpException, HttpStatus } from '@nestjs/common';
import { EmailNotVerifiedError } from '../domain/errors/email-notverified.error';

export class ErrorMapper {
  static toHttp(error: unknown): HttpException {
    if (error instanceof EmailNotVerifiedError) {
      return new HttpException(
        {
          message: error.message,
          code: 'EMAIL_NOT_VERIFIED',
          action: 'RESEND_VERIFICATION_LINK',
        },
        HttpStatus.FORBIDDEN,
      );
    }

    return new HttpException(
      'Internal server error',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
