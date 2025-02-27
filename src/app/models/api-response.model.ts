export interface ApiResponse<T> {
  status: string;
  content: T[];
}

export const SUCCESS_STATUS = 'success'; 