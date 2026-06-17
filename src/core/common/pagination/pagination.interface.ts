export interface PagePaginationQuery {
  page?: number;
  limit?: number;
}

export interface PagePaginatedResult<T> {
  data: T[];
  totalItems: number;
  currentPage: number;
  limit: number;
  totalPages: number;
}

export class PaginatedResultDto<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
