// src/modules/users/domain/errors/email-not-verified.error.ts
// domain/errors/email-notverified.error.ts
export class EmailNotVerifiedError extends Error {
  constructor() {
    super('Your email address has not been verified.');
  }
}

// import { HttpException, HttpStatus } from '@nestjs/common';

// export class EmailNotVerifiedError extends HttpException {
//   constructor() {
//     super(
//       {
//         statusCode: HttpStatus.FORBIDDEN,
//         message: 'Your email address has not been verified.',
//         error: 'EMAIL_NOT_VERIFIED',
//       },
//       HttpStatus.FORBIDDEN,
//     );
//   }
// }
