// application/use-cases/list-users/list-users.dto.ts
export interface ListUsersInput {
  page: number;
  limit: number;
  search?: string;
  role?: string;
}

// export interface ListUsersOutput {
//   users: UserModel[];
//   total: number;
//   page: number;
//   limit: number;
// }