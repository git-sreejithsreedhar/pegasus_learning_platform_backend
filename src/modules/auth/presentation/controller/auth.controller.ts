import {
  Body,
  Controller,
  Inject,
  Post,
  Res,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import express from 'express';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
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
import {
  TokenInvalidException,
  EmailServiceFailedException,
  OperationFailedException,
} from 'src/core/common/errors/app-exceptions';
import { ResendEmailDto } from '../inputs/resend-email.dto';
import { ForgotPasswordDto } from '../inputs/forgot-password.dto';
import { UpdatePasswordDto } from '../inputs/update-password.dto';
import { VerifyEmailDto } from '../inputs/verify-email.dto';

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
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: Logger,
  ) {}

  /**
   * User login endpoint
   * Validates credentials and returns access token + refresh token cookie
   */
  @Post('login')
  async login(
    @Body() credentials: LoginInput,
    @Res({ passthrough: true }) res: express.Response,
  ) {
    this.logger.log(`Login attempt for email: ${credentials.email}`);

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

    this.logger.log(`Login successful for user: ${user._id}`);

    return { user, accessToken };
  }

  /**
   * Send verification email to user
   */
  @Post('send-verification-mail')
  async sendVerificationEmail(
    @Body() body: sendMailDto,
  ): Promise<{ message: string }> {
    try {
      this.logger.log(`Sending verification email to: ${body.email}`);

      await this.sendVerificationMailUsecase.execute({
        _id: body.userId,
        email: body.email,
      });

      this.logger.log(`Verification email sent to: ${body.email}`);

      return { message: 'Verification email has been sent' };
    } catch (error) {
      this.logger.error(
        `Failed to send verification email to ${body.email}`,
        error instanceof Error ? error.stack : undefined,
      );
      throw new EmailServiceFailedException(
        'Failed to send verification email',
      );
    }
  }

  /**
   * Verify user email with token
   */
  @Post('verify-email')
  async verifyEmail(@Body() verifyEmailDto: VerifyEmailDto) {
    try {
      this.logger.log('Email verification attempt');

      await this.mailVerificationUsecase.execute(verifyEmailDto.token);

      this.logger.log('Email verified successfully');

      return {
        success: true,
        message: 'Email verified successfully',
      };
    } catch (error) {
      if (error instanceof Error && error.message.includes('expired')) {
        this.logger.warn('Email verification token expired');
        throw new TokenInvalidException('Verification token has expired');
      }

      this.logger.error(
        'Email verification failed',
        error instanceof Error ? error.stack : undefined,
      );
      throw error;
    }
  }

  /**
   * Resend verification email
   */
  @Post('resend-email')
  async resendMail(@Body() resendEmailDto: ResendEmailDto) {
    try {
      this.logger.log(
        `Resending verification email to: ${resendEmailDto.email}`,
      );

      await this.resendEmailUsecase.execute(resendEmailDto.email);

      this.logger.log(`Verification email resent to: ${resendEmailDto.email}`);

      return { message: 'Verification email has been resent' };
    } catch (error) {
      this.logger.error(
        `Failed to resend email to ${resendEmailDto.email}`,
        error instanceof Error ? error.stack : undefined,
      );
      throw new EmailServiceFailedException(
        'Failed to resend verification email',
      );
    }
  }

  /**
   * Initiate password reset process
   */
  @Post('forgot-password')
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    try {
      this.logger.log(
        `Password reset requested for: ${forgotPasswordDto.email}`,
      );

      await this.forgotPasswordUsecase.execute(forgotPasswordDto.email);

      this.logger.log(
        `Password reset email sent to: ${forgotPasswordDto.email}`,
      );

      // Return generic message for security (don't confirm if email exists)
      return {
        message:
          'If this email exists in our system, you will receive a password reset link',
      };
    } catch (error) {
      this.logger.error(
        `Password reset failed for ${forgotPasswordDto.email}`,
        error instanceof Error ? error.stack : undefined,
      );

      // Return generic message even on error (security best practice)
      return {
        message:
          'If this email exists in our system, you will receive a password reset link',
      };
    }
  }

  /**
   * Update password with reset token
   */
  @Post('update-password')
  async updatePassword(@Body() updatePasswordDto: UpdatePasswordDto) {
    try {
      this.logger.log('Password update attempt');

      await this.updatePasswordUsecase.execute(
        updatePasswordDto.newPassword,
        updatePasswordDto.token,
      );

      this.logger.log('Password updated successfully');

      return { message: 'Password updated successfully' };
    } catch (error) {
      this.logger.error(
        'Password update failed',
        error instanceof Error ? error.stack : undefined,
      );

      if (
        error instanceof Error &&
        error.message.toLowerCase().includes('token')
      ) {
        throw new TokenInvalidException(
          'Password reset token is invalid or has expired',
        );
      }

      if (error instanceof Error && error.message.includes('password')) {
        throw error;
      }

      throw new OperationFailedException('Failed to update password');
    }
  }
}
