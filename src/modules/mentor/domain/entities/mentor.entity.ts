import { Review } from '../interface/review.interface';

export interface MentorDocuments {
  identificationDoc?: string;
  educationalDoc?: string;
  professionalDoc?: string;
  additionalDoc?: string;
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
  ) {}
}
