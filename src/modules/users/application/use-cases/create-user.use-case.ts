import type { IUserRepository } from '../../domain/repositories/users-repository.interface';
import { CreateUserDto } from '../dtos/create-user.dto';
import { User } from '../../domain/entities/users.entity';
import { PASSWORD_SERVICE, USER_REPOSITORY } from '../../domain/tokens/tokens';
import { Inject } from '@nestjs/common';
import type { IPasswordService } from 'src/core/common/security/password-hasher.interface';
import * as verificationTriggerInterface from '../interfaces/verification-trigger.interface';
import { ResourceConflictError } from 'src/core/common/errors/resource-conflict.error';
export class CreateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,

    @Inject(PASSWORD_SERVICE)
    private readonly passwordService: IPasswordService,

    @Inject(verificationTriggerInterface.VERIFICATION_TRIGGER)
    private readonly verificationTrigger: verificationTriggerInterface.IVerificationTrigger,
  ) {}

  async execute(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.userRepository.findByEmail(
      createUserDto.email,
    );

    if (existingUser) {
      throw new ResourceConflictError('User already exists.');
    }

    const hashedPassword = await this.passwordService.hash(
      createUserDto.password,
    );

    const user = User.create({
      ...createUserDto,
      password: hashedPassword,
    });

    const savedUser = await this.userRepository.save(user);

    await this.verificationTrigger.execute(savedUser);

    return savedUser;
  }
}
