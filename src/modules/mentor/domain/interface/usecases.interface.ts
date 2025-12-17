import { Mentor } from '../../domain/entities/mentor.entity';
import { MentorRegisterDto } from '../../presentation/dto/create-mentor.dto';

// create mentor usecase interface
export interface ICreateMentorUsecase {
  execute(
    userId: string,
    mentorData: MentorRegisterDto,
    files?: Express.Multer.File[],
  ): Promise<Mentor | undefined>;
}

// export class UpdateMentorUseCase {
//   constructor(private readonly mentorRepo: IMentorRepository) {}

//   async execute(id: string, data: Partial<Mentor>): Promise<Mentor> {
//     return this.mentorRepo.update(id, data);
//   }
// }

// export class ApproveMentorUseCase {
//   constructor(private readonly mentorRepo: IMentorRepository) {}

//   async execute(id: string): Promise<Mentor> {
//     return this.mentorRepo.approveMentor(id);
//   }
// }

// export class FindMentorByUserIdUseCase {
//   constructor(private readonly mentorRepo: IMentorRepository) {}

//   async execute(userId: string): Promise<Mentor | null> {
//     return this.mentorRepo.findByUserId(userId);
//   }
// }
