// import { IUserRepository } from 'src/modules/users/domain/repositories/users-repository.interface';
// import { IMentorRegisterUsecase } from '../interfaces/mentor-usecase.interface';
// import { Logger } from 'winston';
// import { IFileStorage } from 'src/core/common/upload/file-storage.interface';
// import { HttpException } from '@nestjs/common';
// import { IMentorRepository } from '../../domain/interface/mentor.-repository.interface';

// export class MentorRegisterUsecase implements IMentorRegisterUsecase {
//   constructor(
//     private readonly mentorRepo: IMentorRepository,
//     private readonly userRepo: IUserRepository,
//     private readonly fileStorage: IFileStorage,
//     private readonly logger: Logger,
//   ) {}

//   async execute(
//     userId: string,
//     data: MentorData,
//     files: Express.Multer.File[],
//   ) {
//     const user = await this.userRepo.findById(userId);

//     if (!user) {
//       throw new HttpException('User not found', 404);
//     }

//     const documents: any = {};

//     for (const file of files) {
//       const filePath = await this.fileStorage.save(file);
//       documents[file.fieldname] = filePath;
//     }

//     user.profile = {
//       ...user.profile,
//       avatar: mentorData.avatar,
//       bio: mentorData.bio,
//       name: mentorData.name,
//     };

//      await this.userRepo.update(user);

//     const mentor = await this.mentorRepo.create({
//       userId,
//       about: mentorData.about,
//       primarySkill: mentorData.primarySkill,
//       expertise: mentorData.expertise,
//       skillProficiency: mentorData.skillProficiency,
//       yearsExperience: mentorData.yearsExperience,
//       socialLinks: mentorData.socialLinks,
//       communicationPreference: mentorData.communicationPref,
//       hourlyRate: mentorData.hourlyRate,
//       documents: documents,
//     });

//     return mentor;
//   }
// }
