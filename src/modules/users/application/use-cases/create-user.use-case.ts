import { IUserRepository } from '../../domain/repositories/users-repository.interface';
import { IPasswordService } from '../security/password-hasher.interface';
import { CreateUserDto } from '../dtos/create-user.dto';
import { User } from '../../domain/entities/users.entity';

export class CreateUserUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
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
