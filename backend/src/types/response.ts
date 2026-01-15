/**
 * Common response types used across the API
 */

export interface ErrorResponse {
  error: string;
}

export interface SuccessResponse<T = unknown> {
  success: boolean;
  data?: T;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}
