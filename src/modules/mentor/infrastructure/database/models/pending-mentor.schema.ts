// pending-mentor.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class PendingMentorModel {
  @Prop({ required: true })
  _id: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ required: true })
  yearsExperience: number;

  @Prop({ required: true })
  primarySkill: string;

  @Prop({ type: Array, default: [] })
  expertise: string[];

  @Prop({ type: Array, default: [] })
  customSkills: string[];

  @Prop()
  skillProficiency: number;

  @Prop()
  about: string;

  @Prop()
  communicationPref: string;

  @Prop()
  hourlyRate: number;

  // Profile block
  @Prop({
    type: {
      avatar: String,
      name: String,
      bio: String,
    },
  })
  profile;

  // social links
  @Prop({
    type: {
      linkedin: String,
      twitter: String,
      youtube: String,
      github: String,
      website: String,
    },
    default: {},
  })
  socialLinks;

  // uploaded documents
  @Prop({
    type: {
      identificationDoc: String,
      educationalDoc: String,
      professionalDoc: String,
      additionalDoc: String,
    },
    default: {},
  })
  documents;

  // verification fields
  @Prop({
    type: {
      status: { type: String, default: 'pending' },
      verifiedAt: Date,
      verifiedBy: String,
      rejectionReason: String,
      documentsReviewed: { type: Boolean, default: false },
    },
    default: {
      status: 'pending',
      documentsReviewed: false,
    },
  })
  verificationStatus;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const PendingMentorSchema =
  SchemaFactory.createForClass(PendingMentorModel);
