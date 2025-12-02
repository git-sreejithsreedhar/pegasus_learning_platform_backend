// import { IUserRepository } from 'src/modules/users/domain/repositories/users-repository.interface';
// import { MentorRegisterDto } from '../dtos/mentor-register.dto';
// import { MentorVerificationStatusDto } from '../dtos/mentor.dto';
// import { IMentorRegisterUsecase } from '../interfaces/mentor-usecase.interface';
// import { Logger } from 'winston';
// import { IFileStorage } from 'src/core/common/upload/file-storage.interface';
// import { IMentorRepository } from '../interfaces/mentor-repository.interface';

// export class MentorRegisterUsecase implements IMentorRegisterUsecase {
//   constructor(
//     private readonly mentorRepo: IMentorRepository,
//     private readonly userRepo: IUserRepository,
//     private readonly fileStorage: IFileStorage,
//     private readonly logger: Logger,
//   ) {}

//   async execute(
//     data: MentorRegisterDto,
//     files: Express.Multer.File,
//   ): Promise<MentorVerificationStatusDto> {
//     const documents = {};

//     for (const file of files) {
//       const filePath = await this.fileStorage.save(file);
//       documents[file.fieldname] = filePath;
//     }

//     // return this.mentorRepo.save({
//     //   ...data,
//     //   documents,
//     // });
//   }
// }
