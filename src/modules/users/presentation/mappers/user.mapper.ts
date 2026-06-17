import { CreateUserInput } from '../inputs/create-user.input';
import { CreateUserDto } from '../../application/dtos/create-user.dto';

export class UserMapper {
  public static toCreateUserDto(input: CreateUserInput): CreateUserDto {
    return {
      name: input.name,
      email: input.email,
      password: input.password,
      roles: input.roles,
      // preferences: input.preferences ?? [],
      // profile: {
      //   name: input.profile.name,
      //   avatar: input.profile.avatar,
      //   bio: input.profile.bio,
      // },
    };
  }
}
