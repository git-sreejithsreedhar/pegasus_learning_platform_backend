import { HttpStatusCode } from '../enums/http-status.enum';
import { LogMessages } from '../enums/log-messages.enum';

export const ResponseConstants = {
  USER_NOT_FOUND: {
    statuscode: HttpStatusCode.NOT_FOUND,
    message: LogMessages.USER_NOT_FOUND,
  },

  LOGIN_FAILED: {
    statusCode: HttpStatusCode.UNAUTHORIZED,
    message: LogMessages.LOGIN_FAILED,
  },

  SERVER_ERROR: {
    statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
    message: LogMessages.SERVER_ERROR,
  },
};
