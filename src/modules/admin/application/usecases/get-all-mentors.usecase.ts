import { Inject, Injectable } from '@nestjs/common';
import * as mentorRepositoryInterface from 'src/modules/mentor/domain/interface/mentor.repository.interface';
import {
  AdminUserStatus,
  IFindAllMentorsUsecase,
  MentorSortBy,
  SortOrder,
} from '../interfaces/usecases.interface';
// import { Mentor } from 'src/modules/mentor/domain/entities/mentor.entity';
import { USER_REPOSITORY } from 'src/modules/users/domain/tokens/tokens';
import * as usersRepositoryInterface from 'src/modules/users/domain/repositories/users-repository.interface';
import { AdminUserListDto } from '../dtos/admin-user-list.dto';
import { PaginatedResultDto } from 'src/core/common/pagination/pagination.interface';
import { MENTOR_REPOSITORY_TOKEN } from 'src/modules/mentor/domain/tokens/injection-tokens.constant';

@Injectable()
export class GetAllMentorsUsecase implements IFindAllMentorsUsecase {
  constructor(
    @Inject(MENTOR_REPOSITORY_TOKEN)
    private readonly mentorRepo: mentorRepositoryInterface.IMentorRepository,
    @Inject(USER_REPOSITORY)
    private readonly userRepo: usersRepositoryInterface.IUserRepository,
  ) {}

  async execute(params?: {
    page?: number;
    limit?: number;
    status?: AdminUserStatus;
    sortBy?: MentorSortBy;
    sortOrder?: SortOrder;
  }): Promise<PaginatedResultDto<AdminUserListDto>> {
    // const mentors = await this.mentorRepo.getAllMentors();
    // const users = await this.userRepo.findByIds(mentors.map((m) => m.userId));

    // const userMap = new Map(users.map((u) => [u._id, u]));

    // return mentors.map((mentor) => {
    //   const user = userMap.get(mentor.userId);

    //   return {
    //     id: user!._id,
    //     name: user!.name,
    //     email: user!.email,

    //     role: 'Mentor',

    //     status: !mentor.isApproved
    //       ? 'pending'
    //       : user!.isBlocked
    //         ? 'blocked'
    //         : user!.isActive
    //           ? 'active'
    //           : 'inactive',

    //     joinDate: formatDate(user!.createdAt),

    //     courses: mentor.totalCourses,
    //     rating: calculateRating(mentor.ratings),
    //   };
    // });

    // const count = await this.mentorRepo.totalMentorsCount();
    // console.log(count);
    const res = await this.mentorRepo.getAdminMentorList(params ?? {});
    // console.log(res);
    return res;
  }
}

// function formatDate(date: Date): string {
//   return date.toISOString().split('T')[0];
// }

// function calculateRating(ratings: number[]): number {
//   if (!ratings || ratings.length === 0) return 0;

//   const avg = ratings.reduce((sum, r) => sum + r, 0) / ratings.length;

//   return Number(avg.toFixed(1));
// }
