import { User } from 'src/modules/users/domain/entities/users.entity';

// Login usecase interface
export interface ILoginUsecase {
  execute(
    email: string,
    password: string,
  ): Promise<{ user: User; accessToken: string; refreshToken: string }>;
}

// logout usecase interface
export interface ILogOut {
  execute(refreshToken: string): Promise<void>;
}

// send Email usecase interface
export interface ISendVerificationMailUsecase {
  execute(data: { _id: string; email: string; name?: string }): Promise<void>;
}

// Verify Email usecase interface
export interface IVerifyMailUsecase {
  execute(token: string): Promise<void>;
}

// Forgot password usecase interface
export interface IForgotPasswordUsecase {
  execute(email: string): Promise<{ message: string }>;
}

// Resend verification link usecase interface
export interface IResendEmailUsecase {
  execute(email: string): Promise<void>;
}

// Update password usecase interface
export interface IUpdatePasswordUsecase {
  execute(newPassword: string, token: string);
}
