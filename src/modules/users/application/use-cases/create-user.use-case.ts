import type { IUserRepository } from '../../domain/repositories/users-repository.interface';
import { CreateUserDto } from '../dtos/create-user.dto';
import { User } from '../../domain/entities/users.entity';
import { PASSWORD_SERVICE, USER_REPOSITORY } from '../../domain/tokens/tokens';
import { Inject } from '@nestjs/common';
import type { IPasswordService } from 'src/core/common/security/password-hasher.interface';

export class CreateUserUseCase {
  // constructor(
  //   private readonly userRepository: IUserRepository,
  //   private readonly passwordService: IPasswordService,
  // ) {}

  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,

    @Inject(PASSWORD_SERVICE)
    private readonly passwordService: IPasswordService,
  ) {}

  async execute(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.userRepository.findByEmail(
      createUserDto.email,
    );

    if (existingUser) {
      throw new Error('User already exists.');
    }

    const hashedPassword = await this.passwordService.hash(
      createUserDto.password,
    );

    const user = User.create({
      ...createUserDto,
      password: hashedPassword,
    });

    return await this.userRepository.save(user);
  }
}
