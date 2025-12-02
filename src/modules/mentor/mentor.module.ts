import { Module } from '@nestjs/common';
import { MentorController } from './presentation/mentor.controller';
import { UsersModule } from '../users/users.module';
import { FILE_STORAGE } from 'src/core/common/upload/file-storage.token';
import { FileStorageModule } from 'src/core/common/upload/file-storage.module';
import { USER_REPOSITORY } from '../users/domain/tokens/tokens';
import { LocalFileStorageService } from 'src/core/common/upload/upload.service';
import { MongoUserRepository } from '../users/infrastructure/database/repositories/mongo-user.repository';

@Module({
  imports: [UsersModule, FileStorageModule],
  providers: [
    {
      provide: FILE_STORAGE,
      useClass: LocalFileStorageService,
    },
    {
      provide: USER_REPOSITORY,
      useClass: MongoUserRepository,
    },
  ],
  controllers: [MentorController],

  exports: [FILE_STORAGE, USER_REPOSITORY],
})
export class MentorModule {}
