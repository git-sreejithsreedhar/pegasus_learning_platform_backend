import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { MentorModule } from '../mentor/mentor.module';
import { AdminController } from './presentation/controller/admin.controller';
import {
  FIND_ALL_MENTORS_USECASE,
  GET_MENTOR_DETAILS_USECASE,
} from './application/tokens';
import { GetAllMentorsUsecase } from './application/usecases/get-all-mentors.usecase';
import { GetMentorDetailsUsecase } from './application/usecases/get-mentor-details.usecase';

@Module({
  imports: [UsersModule, MentorModule],

  controllers: [AdminController],

  providers: [
    {
      provide: FIND_ALL_MENTORS_USECASE,
      useClass: GetAllMentorsUsecase,
    },
    {
      provide: GET_MENTOR_DETAILS_USECASE,
      useClass: GetMentorDetailsUsecase,
    },
  ],

  exports: [],
})
export class AdminModule {}
