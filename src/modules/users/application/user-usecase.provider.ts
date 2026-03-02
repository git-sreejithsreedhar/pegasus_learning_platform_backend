import { Provider } from '@nestjs/common';
import {
  USER_REPOSITORY,
  FIND_OR_CREATE_SOCIAL_USER,
} from '../domain/tokens/tokens';
import { MongoUserRepository } from '../infrastructure/database/repositories/mongo-user.repository';
import { FindOrCreateSocialUser } from './use-cases/findOrCreateUser.usecase';

export const UserUsecaseProviders: Provider[] = [
  {
    provide: USER_REPOSITORY,
    useClass: MongoUserRepository,
  },
  {
    provide: FIND_OR_CREATE_SOCIAL_USER,
    useClass: FindOrCreateSocialUser,
  },
];
