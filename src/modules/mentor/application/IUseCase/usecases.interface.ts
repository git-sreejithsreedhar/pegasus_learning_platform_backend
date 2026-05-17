import { CreateMentorResponse } from '../dto/create-mentor.response';
// import { Mentor } from '../../domain/entities/mentor.entity';
import { MentorRegisterDto } from '../../presentation/dto/create-mentor.dto';
import { EligibilityResult } from '../usecases/create-mentor.usecase';

// create mentor usecase interface
export interface ICreateMentorUsecase {
  execute(
    userId: string,
    mentorData: MentorRegisterDto,
  ): Promise<CreateMentorResponse>;

  checkEligibility(userId: string): Promise<EligibilityResult>;
}

// approve mmentor
export interface IApproveMentorUsecase {
  execute(mentorId: string): Promise<void>;
}

// reject mentor
export interface IRejectMentorUsecase {
  execute(mentorId: string, reason: string): Promise<void>;
}

// request correction
export interface IRequestMentorCorrectionUsecase {
  execute(mentorId: string, reason: string): Promise<void>;
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
