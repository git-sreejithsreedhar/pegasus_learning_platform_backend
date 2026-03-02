import { Inject } from '@nestjs/common';
import type { IUserRepository } from '../../domain/repositories/users-repository.interface';
import { USER_REPOSITORY } from '../../domain/tokens/tokens';
import { IFindOrCreateSocailUser } from '../../domain/interfaces/usecase.interface';
import { User } from '../../domain/entities/users.entity';

export class FindOrCreateSocialUser implements IFindOrCreateSocailUser {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(profile: {
    email: string;
    name: string;
    avatar: string;
    auth0Id: string;
  }): Promise<User | null> {
    const existingUser = await this.userRepository.findByEmail(profile.email);

    // If user exists, link Auth0 ID if not already set
    if (existingUser) {
      if (!existingUser.auth0Id) {
        existingUser.auth0Id = profile.auth0Id;
        await this.userRepository.update(existingUser);
      }
      return existingUser;
    }

    // Create new social user using the factory method
    const newUser = User.createSocial({
      email: profile.email,
      name: profile.name,
      avatar: profile.avatar ?? '',
      auth0Id: profile.auth0Id,
    });

    return await this.userRepository.save(newUser);
  }
}
