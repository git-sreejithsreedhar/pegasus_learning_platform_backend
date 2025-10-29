import { CreateUserDto } from '../../application/dtos/create-user.dto';
import { User } from '../entities/users.entity';

export interface IUserUseCase {
  createUser(data: CreateUserDto): Promise<User | null>;
}
