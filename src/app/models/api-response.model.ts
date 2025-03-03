export interface ApiResponse<T> {
  status: string;
  pagination: Pagination;
  content: T[];
}

export interface Pagination {
  pageNumber: number;
  pageSize: number;
  total: number;
}

export const SUCCESS_STATUS = 'success'; 