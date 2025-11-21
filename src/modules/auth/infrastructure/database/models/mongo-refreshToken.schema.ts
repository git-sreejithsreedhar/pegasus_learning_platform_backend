// src/modules/auth/infrastructure/database/models/auth.schema.ts

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RefreshTokenDocument = RefreshTokenPersistence & Document;

@Schema({
  collection: 'refresh_tokens',
  strict: true,
})
export class RefreshTokenPersistence {
  @Prop({ type: String, required: true, unique: true, index: true })
  userId: string;

  @Prop({ type: String, required: true, unique: true })
  token: string;

  @Prop({ type: Date, required: true })
  expiresAt: Date;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const RefreshTokenSchema = SchemaFactory.createForClass(
  RefreshTokenPersistence,
);
