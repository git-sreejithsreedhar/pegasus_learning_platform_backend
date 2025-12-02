// import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

// @Schema({ timestamps: true })
// export class MentorModel {
//   @Prop({ required: true })
//   _id: string;

//   @Prop({ type: Array })
//   expertise;

//   @Prop({ type: Object })
//   socialLinks;

//   @Prop()
//   about: string;

//   @Prop({ default: false })
//   isVerified;

//   @Prop({
//     type: {
//       isVerified: Boolean,
//       verifiedAt: Date,
//       verifiedBy: String,
//       rejectionReason: String,
//       documentsReviewed: Boolean,
//       profileCompleted: Boolean,
//     },
//     default: {
//       isVerified: false,
//       profileCompleted: true,
//       documentsReviewed: false,
//     },
//   })
//   verificationStatus;

//   @Prop({
//     type: {
//       identificationDoc: String,
//       educationalDoc: String,
//       professionalDoc: String,
//       additionalDoc: String,
//     },
//     default: {},
//   })
//   documents: {
//     identificationDoc?: string;
//     educationalDoc?: string;
//     professionalDoc?: string;
//     additionalDoc?: string;
//   };

//   @Prop({ default: 0 })
//   totalStudents: number;

//   @Prop({ default: 0 })
//   totalCourses: number;

//   @Prop({ type: Array, default: [] })
//   studentReviews;

//   @Prop({ default: 0 })
//   completionRate: number;

//   @Prop({ default: 0 })
//   rating: number;

//   @Prop({ type: String, default: 'any' })
//   communicationPreference: string;

//   @Prop()
//   hourlyRate?: number;
// }

// export const MentorSchema = SchemaFactory.createForClass(MentorModel);
