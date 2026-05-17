// import { Mentor } from 'src/modules/mentor/domain/entities/mentor.entity';
import { PaginatedResultDto } from 'src/core/common/pagination/pagination.interface';
import { AdminUserListDto } from '../dtos/admin-user-list.dto';
import { MentorDetailsResponseDto } from '../dtos/get-mentor-details.dto';

export type SortOrder = 'asc' | 'desc';

// Metor listing
export enum MentorSortBy {
  JOIN_DATE = 'joinDate',
  NAME = 'name',
  EMAIL = 'email',
  RATING = 'rating',
  COURSES = 'courses',
  STATUS = 'status',
}

export enum AdminUserStatus {
  PENDING = 'pending',
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  BLOCKED = 'blocked',
}

export interface IFindAllMentorsUsecase {
  execute(params?: {
    page?: number;
    limit?: number;
    status?: AdminUserStatus;
    sortBy?: MentorSortBy;
    sortOrder?: SortOrder;
  }): Promise<PaginatedResultDto<AdminUserListDto>>;
}

export interface IGetMentorDetailsUsecase {
  execute(mentorId: string): Promise<MentorDetailsResponseDto>;
}
