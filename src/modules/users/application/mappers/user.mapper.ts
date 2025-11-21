import { CreateUserInput } from 'src/modules/users/presentation/inputs/create-user.input';
import { CreateUserDto } from '../dtos/create-user.dto';

export class UserMapper {
  public static toCreateUserDto(input: CreateUserInput): CreateUserDto {
    const profileDto = {
      ...input.profile,
      name: input.name,
    };

    return {
      email: input.email,
      password: input.password,
      role: input.role,
      preferences: input.preferences,
      profile: profileDto,
    } as CreateUserDto;
  }
}
