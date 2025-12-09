import { Body, Controller, HttpException, Inject, Post } from '@nestjs/common';
import { sendMailDto } from '../inputs/send-mail.dto';
import {
  ILoginUsecaseToken,
  ISendVerificationMailUsecaseToken,
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
  ) {}

  // user login
  @Post('login')
  async login(
    @Body() credentials: LoginInput,
  ): Promise<{ user: User; accessToken: string; refreshToken: string }> {
    const { user, accessToken, refreshToken } = await this.loginUsecase.execute(
      credentials.email,
      credentials.password,
    );

    return {
      user,
      accessToken,
      refreshToken,
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
      throw new HttpException(
        error?.message || 'Email verification failed',
        error?.status || 400,
      );
    }
  }

  //   forgot password
  // async forgotPassword(
  //   @Body('email') email: string,
  // ): Promise<{ message: string }> {
  //   try {
  //     await this.forgotPasswordUsecase.execute(email);
  //   } catch (err) {
  //     console.error(err);
  //   }
  // }
}
