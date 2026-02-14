import { MentorStatus } from '../../domain/entities/mentor.entity';

export type CreateMentorResponse =
  | {
      type: 'STATUS';
      status: MentorStatus;
      message: string;
      feedback?: {
        mentorMessage: string;
        action: MentorStatus;
      };
    }
  | {
      type: 'CREATED';
      status: MentorStatus;
      message: string;
      mentorId: string;
    };
