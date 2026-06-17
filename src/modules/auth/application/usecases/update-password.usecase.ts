import { IUserRepository } from 'src/modules/users/domain/repositories/users-repository.interface';
import { Logger } from 'winston';
import { IUpdatePasswordUsecase } from '../interfaces/auth-usecase.interface';
import { ITokenService } from '../interfaces/token-service.interface';
import { HttpException } from '@nestjs/common';
import { IPasswordService } from 'src/core/common/security/password-hasher.interface';

export class UpdatePasswordUsecase implements IUpdatePasswordUsecase {
  constructor(
    private readonly tokenService: ITokenService,
    private readonly userRepo: IUserRepository,
    private readonly passwordService: IPasswordService,
    private readonly logger: Logger,
  ) {}
  async execute(newPassword: string, token: string) {
    try {
      const data = await this.tokenService.verifyEmailVerificationToken(token);
      if (!data) {
        throw new HttpException('Invalid token type', 400);
      }

      const userId = data?.payload?.userId;
      if (!userId) throw new HttpException('Invalid token payload.', 400);

      const user = await this.userRepo.findById(userId);

      if (!user) {
        throw new HttpException('User not found.', 404);
      }

      const hashedPassword = await this.passwordService.hash(newPassword);

      user.password = hashedPassword;

      const updated = await this.userRepo.update(user);

      if (!updated) {
        throw new HttpException('Failed to update password.', 500);
      }

      return {
        message: 'Password updated successfully',
      };
    } catch (error) {
      this.logger.error('Password update failed: ' + error);
      throw error;
    }
  }
}
