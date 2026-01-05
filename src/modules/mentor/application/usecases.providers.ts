import { USER_REPOSITORY } from 'src/modules/users/domain/tokens/tokens';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Provider } from '@nestjs/common';
import { Logger } from 'winston';
import { FILE_STORAGE } from 'src/core/common/upload/file-storage.token';
import { CreateMentorUsecase } from './usecases/create-mentor.usecase';
import { IUserRepository } from 'src/modules/users/domain/repositories/users-repository.interface';
import { IFileStorage } from 'src/core/common/upload/file-storage.interface';
import {
  APPROVE_MENTOR_USECASE,
  CREATE_MENTOR_USECASE,
  MENTOR_REPOSITORY_TOKEN,
  REJECT_MENTOR_USECASE,
  REQUEST_MENTOR_CORRECTION_USECASE,
} from '../domain/tokens/injection-tokens.constant';
import { IMentorRepository } from '../domain/interface/mentor.repository.interface';
import { ApproveMentorUseCase } from './usecases/approve-mentor.usecase';
import { RejectMentorUsecase } from './usecases/reject-mentor.usecase';
import { RequestMentorCorrectionUsecase } from './usecases/request-mentor-correction.usecase';

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

  {
    provide: APPROVE_MENTOR_USECASE,
    useFactory: (
      mentorRepo: IMentorRepository,
      userRepo: IUserRepository,
      logger: Logger,
    ) => new ApproveMentorUseCase(mentorRepo, userRepo, logger),
    inject: [MENTOR_REPOSITORY_TOKEN, USER_REPOSITORY, WINSTON_MODULE_PROVIDER],
  },

  {
    provide: REJECT_MENTOR_USECASE,
    useFactory: (mentorRepo: IMentorRepository, logger: Logger) =>
      new RejectMentorUsecase(mentorRepo, logger),
    inject: [MENTOR_REPOSITORY_TOKEN, WINSTON_MODULE_PROVIDER],
  },

  {
    provide: REQUEST_MENTOR_CORRECTION_USECASE,
    useFactory: (mentorRepo: IMentorRepository, logger: Logger) =>
      new RequestMentorCorrectionUsecase(mentorRepo, logger),
    inject: [MENTOR_REPOSITORY_TOKEN, WINSTON_MODULE_PROVIDER],
  },
];
