import { Schema, Document } from 'mongoose';

export interface SocialLinks {
  linkedin?: string;
  twitter?: string;
  youtube?: string;
  github?: string;
  website?: string;
}

export interface MentorDocuments {
  identificationDoc?: string;
  educationalDoc?: string;
  professionalDoc?: string;
  additionalDoc?: string;
}

export interface Profile {
  bio?: string;
  avatar?: string;
}

export type MentorDocument = MentorModel & Document;

export class MentorModel {
  _id: string;
  userId: string;
  primarySkill: string;
  expertise: string[];
  skillProficiency: number;
  yearsExperience: number;
  about: string;
  profile: Profile;
  socialLinks: SocialLinks;
  documents: MentorDocuments;
  communicationPref?: string;
  hourlyRate?: number;
  totalStudents: number;
  totalCourses: number;
  reviews: Review[];
  completionRate: number;
  ratings: number[];
  isApproved: boolean;
}

export const MentorSchema = new Schema(
  {
    userId: { type: String, required: true },
    primarySkill: String,
    expertise: [String],
    skillProficiency: Number,
    yearsExperience: Number,
    about: String,

    socialLinks: {
      linkedin: String,
      twitter: String,
      youtube: String,
      github: String,
      website: String,
    },

    profile: {
      bio: String,
      avatar: String,
    },

    documents: {
      identificationDoc: String,
      educationalDoc: String,
      professionalDoc: String,
      additionalDoc: String,
    },

    communicationPref: String,
    hourlyRate: Number,

    // Additional fields
    totalStudents: { type: Number, default: 0 },
    totalCourses: { type: Number, default: 0 },
    reviews: { type: Array, default: [] },
    completionRate: { type: Number, default: 0 },
    ratings: { type: [Number], default: [] },
    isApproved: { type: Boolean, default: false },
  },
  { timestamps: true },
);

// Review
export interface Review {
  reviewerId: string;
  sessionId?: string;
  comment: string;
  rating: number;
  createdAt: Date;
}

export type ReviewDocument = Review & Document;
