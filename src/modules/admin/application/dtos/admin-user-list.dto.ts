export class AdminUserListDto {
  mentorId: string;
  userId: string;
  name: string;
  email: string;

  // roles: string[];
  role: string;

  status: 'active' | 'blocked' | 'inactive' | 'pending';
  // isEmailVerified: boolean;
  joinDate: string;
  courses: number;
  rating: number;
}
