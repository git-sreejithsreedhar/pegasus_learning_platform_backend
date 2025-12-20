// src/types/express.d.ts
declare global {
  namespace Express {
    interface User {
      userId: string;
      email: string;
      role: string;
      emailVerified?: boolean;
      iat?: number;
      exp?: number;
      iss?: string;
    }

    interface Request {
      user?: User;
    }
  }
}

export {};
