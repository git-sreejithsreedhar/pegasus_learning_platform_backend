// import { IUserRepository } from '../users/domain/repositories/users-repository.interface';
// import { Logger } from 'winston';
// import { MentorRegisterUsecase } from './application/usecases/mentor-register.usecase';
// import { IMentorRepository } from './application/interfaces/mentor-repository.interface';
// import { IFileStorage } from 'src/core/common/upload/file-storage.interface';

export interface MentorUsecases {
  // registerMentor: MentorRegisterUsecase;
}

export const MentorSetup = {
  create(
    // mentorRepo: IMentorRepository,
    // userRepo: IUserRepository,
    // fileStorage: IFileStorage,
    // logger: Logger,
  ): MentorUsecases {
    // const registerMentor = new MentorRegisterUsecase(
    //   mentorRepo,
    //   userRepo,
    //   fileStorage,
    //   logger,
    // );

    return {
      // registerMentor,
    };
  },
};
