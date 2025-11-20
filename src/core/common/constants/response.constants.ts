import { HttpStatusCode } from '../enums/http-status.enum';
import { LogMessages } from '../enums/log-messages.enum';

export const ResponseConstants = {
  USER_NOT_FOUND: {
    statuscode: HttpStatusCode.NOT_FOUND,
    message: LogMessages.USER_NOT_FOUND,
  },

  USER_BLOCKED: {
    statusCode: HttpStatusCode.FORBIDDEN,
    message: LogMessages.USER_BLOCKED,
  },

  LOGIN_FAILED: {
    statusCode: HttpStatusCode.UNAUTHORIZED,
    message: LogMessages.LOGIN_FAILED,
  },

  // Server Eror
  SERVER_ERROR: {
    statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
    message: LogMessages.SERVER_ERROR,
  },

  // Token Errors
  TOKEN_INVALID: {
    statusCode: HttpStatusCode.UNAUTHORIZED,
    message: LogMessages.TOKEN_INVALID,
  },

  TOKEN_EXPIRED: {
    statusCode: HttpStatusCode.UNAUTHORIZED,
    message: LogMessages.TOKEN_EXPIRED,
  },

  TOKEN_GENERATION_FAILED: {
    statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
    message: LogMessages.TOKEN_GENERATION_FAILED,
  },

  MAIL_SEND_FAILED: {
    statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
    message: LogMessages.MAIL_SEND_FAILED,
  },

  MAIL_NOT_VERIFIED: {
    statusCode: HttpStatusCode.FORBIDDEN,
    message: LogMessages.MAIL_NOT_VERIFIED,
  },

  // UNAUTHORIZED_EXCEPTION: {
  //   statusCode: HttpStatusCode.UNAUTHORIZED,
  //   message: LogMessages.TOKEN_VERIFICATION_FAILED,
  // },
};
