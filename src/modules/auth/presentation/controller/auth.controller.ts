import {
  Body,
  Controller,
  HttpException,
  Inject,
  Post,
  Res,
} from '@nestjs/common';
import express from 'express';
import { sendMailDto } from '../inputs/send-mail.dto';
import {
  IForgotPasswordUsecaseToken,
  ILoginUsecaseToken,
  IResendEmailUsecaseToken,
  ISendVerificationMailUsecaseToken,
  IUpdatePasswordUsecaseToken,
  IVerifyMailUsecaseToken,
} from '../../application/tokens';
import * as authUsecaseInterface from '../../application/interfaces/auth-usecase.interface';
import { LoginInput } from '../inputs/login-input.dto';
// import { UserModel } from 'src/modules/users/presentation/models/user.type';
import { User } from 'src/modules/users/domain/entities/users.entity';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(ISendVerificationMailUsecaseToken)
    private readonly sendVerificationMailUsecase: authUsecaseInterface.ISendVerificationMailUsecase,
    @Inject(IVerifyMailUsecaseToken)
    private readonly mailVerificationUsecase: authUsecaseInterface.IVerifyMailUsecase,
    @Inject(ILoginUsecaseToken)
    private readonly loginUsecase: authUsecaseInterface.ILoginUsecase,
    @Inject(IResendEmailUsecaseToken)
    private readonly resendEmailUsecase: authUsecaseInterface.IResendEmailUsecase,
    @Inject(IForgotPasswordUsecaseToken)
    private readonly forgotPasswordUsecase: authUsecaseInterface.IForgotPasswordUsecase,
    @Inject(IUpdatePasswordUsecaseToken)
    private readonly updatePasswordUsecase: authUsecaseInterface.IUpdatePasswordUsecase,
  ) {}

  // user login
  @Post('login')
  async login(
    @Body() credentials: LoginInput,
    @Res({ passthrough: true }) res: express.Response,
  ): Promise<{ user: User; accessToken: string }> {
    const { user, accessToken, refreshToken } = await this.loginUsecase.execute(
      credentials.email,
      credentials.password,
    );

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return {
      user,
      accessToken,
      // refreshToken,
    };
  }

  // send email verification mail
  @Post('send-verification-mail')
  async sendVerificationEmail(
    @Body() body: sendMailDto,
  ): Promise<{ message: string }> {
    await this.sendVerificationMailUsecase.execute({
      _id: body.userId,
      email: body.email,
    });
    return { message: 'Verification email has been sent' };
  }

  // verify email
  @Post('verify-email')
  async verifyEmail(@Body('token') token: string) {
    try {
      if (!token) {
        throw new HttpException('Token is required', 400);
      }

      await this.mailVerificationUsecase.execute(token);

      return {
        success: true,
        message: 'Email verified successfully',
      };
    } catch (error) {
      console.error(error);
    }
  }
  // Resend Mail

  @Post('resend-email')
  async resendMail(@Body('email') email: string) {
    try {
      await this.resendEmailUsecase.execute(email);
    } catch (error) {
      console.error(error);
      throw new HttpException('Failed to resend email', 500);
    }
  }
  // forgot password
  @Post('forgot-password')
  async forgotPassword(@Body('email') email: string) {
    return this.forgotPasswordUsecase.execute(email);
    return { message: 'Password updated successfully' };
  }
  // update password
  @Post('update-password')
  async updatePassword(
    @Body('newPassword') newPassword: string,
    @Body('token') token: string,
  ) {
    try {
      await this.updatePasswordUsecase.execute(newPassword, token);
    } catch (error) {
      console.error(error);
      throw new HttpException('Failed to update password', 500);
    }
  }
}
