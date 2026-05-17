import { forwardRef, Module } from '@nestjs/common';
import { MentorController } from './presentation/mentor.controller';
import { UsersModule } from '../users/users.module';
import { FileStorageModule } from 'src/core/common/upload/file-storage.module';
import { MentorProviders } from './infrastructure/database/providers/mentor.providers';
import { MentorUsecaseProviders } from './application/usecases.providers';
import { AuthModule } from '../auth/auth.module';
import { PassportModule } from '@nestjs/passport';
import { MentorRepository } from './infrastructure/database/mongo-mentor.repository';
import { MongooseModule } from '@nestjs/mongoose';
import {
  MentorModel,
  MentorSchema,
} from './infrastructure/database/models/mentor.schema';
import { MentorFileUploadService } from './infrastructure/services/mentor-file-upload.service';

@Module({
  imports: [
    // AuthModule,
    UsersModule,
    forwardRef(() => FileStorageModule),
    forwardRef(() => AuthModule),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    FileStorageModule,
    MongooseModule.forFeature([
      { name: MentorModel.name, schema: MentorSchema },
    ]),
  ],

  controllers: [MentorController],

  providers: [
    ...MentorProviders,
    ...MentorUsecaseProviders,
    MentorRepository,
    MentorFileUploadService,
  ],

  exports: [...MentorProviders, ...MentorUsecaseProviders, MentorRepository],
})
export class MentorModule {}
