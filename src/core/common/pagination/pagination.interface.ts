export interface PagePaginationQuery {
  page?: number;
  limit?: number;
}

export interface PagePaginatedResult<T> {
  items: T[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  limit: number;
}
