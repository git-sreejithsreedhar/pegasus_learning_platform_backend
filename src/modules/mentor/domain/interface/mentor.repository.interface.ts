import { AdminUserListDto } from 'src/modules/admin/application/dtos/admin-user-list.dto';
import { Mentor } from '../entities/mentor.entity';
import { PaginatedResultDto } from 'src/core/common/pagination/pagination.interface';

export interface IMentorRepository {
  create(data: Mentor): Promise<Mentor>;
  // update(id: string, data: Partial<Mentor>): Promise<Mentor>;
  update(mentor: Mentor): Promise<Mentor>;
  findByUserId(userId: string): Promise<Mentor | null>;
  findById(id: string): Promise<Mentor | null>;
  approveMentor(id: string): Promise<Mentor>;
  getAllMentors(): Promise<Mentor[]>;
  // getAllBlockedMentors(): Promise<Mentor[]>;
  getAllPendingMentors(): Promise<Mentor[]>;
  // getAllActiveMentors(): Promise<Mentor[]>;
  totalMentorsCount(): Promise<number>;
  // getAdminMentorList(params: {
  //   status?: 'active' | 'inactive' | 'blocked' | 'pending';
  //   sortBy?: string;
  //   sortOrder?: 'asc' | 'desc';
  // }): Promise<AdminUserListDto[]>;
  getAdminMentorList(params: {
    page?: number;
    limit?: number;
    status?: 'active' | 'inactive' | 'blocked' | 'pending';
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<PaginatedResultDto<AdminUserListDto>>;
}
