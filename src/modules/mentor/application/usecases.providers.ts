import { USER_REPOSITORY } from 'src/modules/users/domain/tokens/tokens';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Provider, Logger } from '@nestjs/common';
import { FILE_STORAGE } from 'src/core/common/upload/file-storage.token';
import { CreateMentorUsecase } from './usecases/create-mentor.usecase';
import { IUserRepository } from 'src/modules/users/domain/repositories/users-repository.interface';
import { IFileStorage } from 'src/core/common/upload/file-storage.interface';
import { CREATE_MENTOR_USECASE } from '../domain/tokens/injection-tokens.constant';
import {
  IMentorRepository,
  MENTOR_REPOSITORY_TOKEN,
} from '../domain/interface/mentor.-repository.interface';

export const MentorUsecaseProviders: Provider[] = [
  {
    provide: CREATE_MENTOR_USECASE,
    useFactory: (
      mentorRepo: IMentorRepository,
      userRepo: IUserRepository,
      fileStorage: IFileStorage,
      logger: Logger,
    ) => new CreateMentorUsecase(mentorRepo, userRepo, fileStorage, logger),
    inject: [
      MENTOR_REPOSITORY_TOKEN,
      USER_REPOSITORY,
      FILE_STORAGE,
      WINSTON_MODULE_PROVIDER,
    ],
  },
];
