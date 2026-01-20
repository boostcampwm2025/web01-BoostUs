export interface ApiResponse<T> {
  success: boolean;
  message: string;
  error: unknown;
  data: T;
}
