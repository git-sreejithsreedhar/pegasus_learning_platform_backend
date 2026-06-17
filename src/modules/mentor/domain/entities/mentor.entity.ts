import { Review } from '../interface/review.interface';

export type MentorStatus =
  | 'approved'
  | 'rejected'
  | 'correction_required'
  | 'pending';

export interface MentorDocuments {
  identificationDoc?: string;
  educationalDoc?: string;
  professionalDoc?: string;
  additionalDoc?: string;
}

export interface Profile {
  avatar?: string;
  bio?: string;
}

export interface AdminFeedback {
  current?: {
    mentorMessage: string;
    action: MentorStatus;
  };
  history: FeedbackHistory[];
}

export interface FeedbackHistory {
  mentorMessage: string;
  action: 'approved' | 'rejected' | 'correction_required' | 'pending';
  date: Date;
}

export class Mentor {
  constructor(
    public readonly _id: string | undefined,
    public readonly userId: string,
    public readonly primarySkill: string,
    public readonly expertise: string[],
    public readonly skillProficiency: number,
    public readonly yearsExperience: number,
    public readonly about: string,
    public readonly profile: Profile,
    public readonly socialLinks: {
      linkedin?: string;
      twitter?: string;
      youtube?: string;
      github?: string;
      website?: string;
    },
    public readonly documents: {
      identificationDoc?: string;
      educationalDoc?: string;
      professionalDoc?: string;
      additionalDoc?: string;
    },
    public totalStudents: number,
    public totalCourses: number,
    public reviews: Review[],
    public completionRate: number,
    public ratings: number[],
    public isApproved: boolean,

    public readonly communicationPref?: string,
    public readonly hourlyRate?: number,

    private status: MentorStatus = 'pending',
    private feedback: AdminFeedback = { history: [] },
  ) {}

  // getters
  get mentorStatus(): MentorStatus {
    return this.status;
  }
  get mentorFeedback(): AdminFeedback {
    return this.feedback;
  }
  get approved(): boolean {
    return this.status === 'approved';
  }

  // request correction
  public requestCorrection(message: string): void {
    const historyEntry: FeedbackHistory = {
      mentorMessage: message,
      action: 'correction_required',
      date: new Date(),
    };

    this.status = 'correction_required';
    this.feedback.current = {
      mentorMessage: message,
      action: 'correction_required',
    };
    this.feedback.history.push(historyEntry);
  }

  // Approve Mentor
  public approve(): void {
    this.status = 'approved';
    this.isApproved = true;

    this.feedback.current = undefined;

    this.feedback.history.push({
      mentorMessage: 'Your mentor profile has been approved.',
      action: 'approved',
      date: new Date(),
    });
  }

  // Reject Mentor
  public reject(reason: string): void {
    this.status = 'rejected';
    this.isApproved = false;

    this.feedback.current = {
      mentorMessage: reason,
      action: 'rejected',
    };

    this.feedback.history.push({
      mentorMessage: reason,
      action: 'rejected',
      date: new Date(),
    });
  }

  // submit changes
  public submitForReview(): void {
    this.status = 'pending';
    this.feedback.current = undefined;
  }
}
