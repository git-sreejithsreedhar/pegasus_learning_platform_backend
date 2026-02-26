import { Schema, model, InferSchemaType, HydratedDocument } from 'mongoose';

// Mentor status enum
export const MENTOR_STATUS = [
  'pending',
  'approved',
  'rejected',
  'correction_required',
] as const;

// File Schema
const FileSchema = new Schema(
  {
    publicId: { type: String, required: true },
    resourceType: {
      type: String,
      required: true,
      enum: ['image', 'video', 'raw'],
    },
    originalName: { type: String },
    uploadedAt: { type: Date, default: Date.now },
  },
  { _id: false },
);

// Profile Schema
const ProfileSchema = new Schema(
  {
    avatar: String,
    bio: { type: String, maxlength: 1000 },
  },
  { _id: false },
);

// Social Links Schema
const SocialLinksSchema = new Schema(
  {
    linkedin: String,
    twitter: String,
    youtube: String,
    github: String,
    website: String,
  },
  { _id: false },
);

// Review Schema
const ReviewSchema = new Schema(
  {
    reviewerId: { type: String, required: true },
    sessionId: String,
    comment: { type: String, required: true, maxlength: 2000 },
    rating: { type: Number, required: true, min: 1, max: 5 },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false },
);

// Feedback History Schema
const FeedbackHistorySchema = new Schema(
  {
    mentorMessage: { type: String, required: true },
    action: { type: String, enum: MENTOR_STATUS, required: true },
    date: { type: Date, default: Date.now },
  },
  { _id: false },
);

// Feedback Schema
const FeedbackSchema = new Schema(
  {
    current: {
      mentorMessage: String,
      action: { type: String, enum: MENTOR_STATUS },
    },
    history: {
      type: [FeedbackHistorySchema],
      default: [],
    },
  },
  { _id: false },
);

//  Main mentor schema
export const MentorSchema = new Schema(
  {
    userId: { type: String, required: true, unique: true },

    primarySkill: { required: true, type: String, index: true },
    expertise: { type: [String], default: [] },

    skillProficiency: { required: true, type: Number, min: 1, max: 100 },
    yearsExperience: { required: true, type: Number, min: 0 },

    about: { required: true, type: String, maxlength: 2000 },

    profile: { type: ProfileSchema, default: {} },
    socialLinks: SocialLinksSchema,

    documents: {
      identificationDoc: FileSchema,
      educationalDoc: FileSchema,
      professionalDoc: FileSchema,
      additionalDoc: FileSchema,
    },

    communicationPref: String,

    hourlyRate: { type: Number, min: 0 },

    status: {
      type: String,
      enum: MENTOR_STATUS,
      default: 'pending',
      index: true,
    },

    feedback: FeedbackSchema,

    totalStudents: { type: Number, default: 0, min: 0 },
    totalCourses: { type: Number, default: 0, min: 0 },

    reviews: {
      type: [ReviewSchema],
      default: [],
    },

    completionRate: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    ratings: {
      type: [Number],
      default: [],
    },

    isApproved: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  { timestamps: true },
);

// ----------------Indexes-----------------

// Compound indexes for optimized filtering
MentorSchema.index({ primarySkill: 1, isApproved: 1 });
MentorSchema.index({ hourlyRate: 1, isApproved: 1 });
MentorSchema.index({ yearsExperience: -1 });
MentorSchema.index({ expertise: 1 });

// Text search index
MentorSchema.index(
  { primarySkill: 'text', about: 'text' },
  { name: 'MentorSearchIndex' },
);

//  TYPES (NO DUPLICATION)
export type MentorPersistence = InferSchemaType<typeof MentorSchema>;
export type MentorDocument = HydratedDocument<MentorPersistence>;

//  MODEL EXPORT
export const MentorModel = model<MentorPersistence>('Mentor', MentorSchema);

// import { Schema, Document } from 'mongoose';

// export interface SocialLinks {
//   linkedin?: string;
//   twitter?: string;
//   youtube?: string;
//   github?: string;
//   website?: string;
// }

// export interface MentorDocuments {
//   identificationDoc?: string;
//   educationalDoc?: string;
//   professionalDoc?: string;
//   additionalDoc?: string;
// }

// export interface Profile {
//   avatar?: string;
//   bio?: string;
// }

// export type MentorStatus =
//   | 'approved'
//   | 'rejected'
//   | 'correction_required'
//   | 'pending';

// export interface FeedbackCurrent {
//   mentorMessage: string;
//   action: MentorStatus;
// }

// export interface FeedbackHistory {
//   mentorMessage: string;
//   action: 'approved' | 'rejected' | 'correction_required' | 'pending';
//   date: Date;
// }

// export interface AdminFeedback {
//   current?: FeedbackCurrent;
//   history: FeedbackHistory[];
// }

// // Review
// export interface Review {
//   reviewerId: string;
//   sessionId?: string;
//   comment: string;
//   rating: number;
//   createdAt: Date;
// }

// export type ReviewDocument = Review & Document;

// export type MentorDocument = MentorModel & Document;

// export class MentorModel {
//   _id: string;
//   userId: string;
//   primarySkill: string;
//   expertise: string[];
//   skillProficiency: number;
//   yearsExperience: number;
//   about: string;
//   profile: Profile;
//   socialLinks: SocialLinks;
//   documents: MentorDocuments;
//   communicationPref?: string;
//   hourlyRate?: number;
//   totalStudents: number;
//   totalCourses: number;
//   reviews: Review[];
//   completionRate: number;
//   ratings: number[];
//   isApproved: boolean;
//   status: MentorStatus;
//   feedback: AdminFeedback;
// }

// // File schema
// export const FileSchema = new Schema(
//   {
//     publicId: { type: String, required: true },
//     originalName: { type: String },
//     uploadedAt: { type: Date, default: Date.now },
//   },
//   { _id: false },
// );

// // Mentor Schema
// export const MentorSchema = new Schema(
//   {
//     userId: { type: String, required: true },
//     primarySkill: String,
//     expertise: [String],
//     skillProficiency: Number,
//     yearsExperience: Number,
//     about: String,
//     profile: {
//       avatar: String,
//       bio: String,
//     },

//     socialLinks: {
//       linkedin: String,
//       twitter: String,
//       youtube: String,
//       github: String,
//       website: String,
//     },

//     documents: {
//       identificationDoc: FileSchema,
//       educationalDoc: FileSchema,
//       professionalDoc: FileSchema,
//       additionalDoc: FileSchema,
//     },

//     communicationPref: String,
//     hourlyRate: Number,

//     // status
//     status: {
//       type: String,
//       enum: ['pending', 'approved', 'rejected', 'correction_required'],
//       default: 'pending',
//     },

//     // fedback
//     feedback: {
//       current: {
//         mentorMessage: { type: String },
//         action: { type: String },
//       },
//       history: [
//         {
//           mentorMessage: String,
//           action: String,
//           date: { type: Date, default: Date.now },
//         },
//       ],
//     },

//     // Additional fields
//     totalStudents: { type: Number, default: 0 },
//     totalCourses: { type: Number, default: 0 },
//     reviews: { type: Array, default: [] },
//     completionRate: { type: Number, default: 0 },
//     ratings: { type: [Number], default: [] },
//     isApproved: { type: Boolean, default: false },
//   },
//   { timestamps: true },
// );

// MentorSchema.index({ userId: 1 }, { unique: true });
// MentorSchema.index({ isApproved: 1 });
// MentorSchema.index({ primarySkill: 1, isApproved: 1 });
// MentorSchema.index({ hourlyRate: 1, isApproved: 1 });
// MentorSchema.index({ yearsExperience: -1 });
// MentorSchema.index({ expertise: 1 });
// MentorSchema.index({ primarySkill: 'text' }, { name: 'MentorSearchIndex' });
// MentorSchema.index({ status: 1 });
