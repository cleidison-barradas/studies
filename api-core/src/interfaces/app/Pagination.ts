export interface PaginationOptions {
  page: number;
  limit: number;
}

export interface PaginationResponse<T> {
  data: Array<T>;
  page: number;
  limit: number;
  totalPages: number;
}
