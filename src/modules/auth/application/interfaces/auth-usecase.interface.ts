import { User } from 'src/modules/users/domain/entities/users.entity';

// Login usecase interface
export interface ILoginUsecase {
  execute(
    email: string,
    password: string,
  ): Promise<{ user: User; accessToken: string; refreshToken: string }>;
}

// logout usecase interface
export interface ILogOut {
  execute(refreshToken: string): Promise<void>;
}
