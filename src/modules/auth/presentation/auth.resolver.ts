// import { Inject, InternalServerErrorException, Logger } from '@nestjs/common';
import * as common from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

import { Resolver, Args, Mutation } from '@nestjs/graphql';
import { LoginInput } from './inputs/login-input.dto';
import { AuthResponse } from './models/auth-response.dto';
import type { ILoginUsecase } from '../application/interfaces/auth-usecase.interface';
import { AUTH_USECASES } from '../application/tokens';
import { ResponseConstants } from 'src/core/common/constants/response.constants';
import { HttpException } from '@nestjs/common';
// import { Logger } from 'winston';

@Resolver()
export class AuthResolver {
  constructor(
    @common.Inject(AUTH_USECASES)
    private readonly authUsecases: { login: ILoginUsecase },

    @common.Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: common.LoggerService,
  ) {}

  // @Mutation(() => AuthResponse)
  // // @UsePipes(new ValidationPipe({ transform: true }))
  // async login(
  //   @Args('input', { type: () => LoginInput }) input: LoginInput,
  // ): Promise<AuthResponse> {
  //   const { email, password } = input;

  //   const result = await this.authUsecases.login.execute(email, password);

  //   return {
  //     user: result.user,
  //     accessToken: result.accessToken,
  //     refreshToken: result.refreshToken,
  //   };
  // }

  // @Mutation(() => AuthResponse)
  // async login(@Args('input') input: LoginInput): Promise<AuthResponse> {
  //   const { email, password } = input;
  //   const result = await this.authUsecases.login.execute(email, password);
  //   return {
  //     user: result.user,
  //     accessToken: result.accessToken,
  //     refreshToken: result.refreshToken,
  //   };
  // }

  @Mutation(() => AuthResponse, { nullable: true })
  async login(@Args('input') input: LoginInput): Promise<AuthResponse | null> {
    const { email, password } = input;
    try {
      this.logger.log(`Login attempt for ${email}`);
      const result = await this.authUsecases.login.execute(email, password);

      this.logger.log(`Login successful for ${email}`);
      return result;
    } catch (error) {
      const status = error instanceof HttpException ? error.getStatus() : 500;
      const message =
        error instanceof HttpException
          ? error.message
          : ResponseConstants.SERVER_ERROR.message;

      this.logger.error(`Login failed for ${email}: ${message}`);
      throw new HttpException(message, status);
    }
  }
}
