import { CreateUserDto } from '../../application/dtos/create-user.dto';
import { User } from '../entities/users.entity';

export interface IUserUseCase {
  createUser(data: CreateUserDto): Promise<User | null>;
}

export interface IFindOrCreateSocailUser {
  execute(profile: {
    email: string;
    name: string;
    auth0Id: string;
  }): Promise<User | null>;
}
