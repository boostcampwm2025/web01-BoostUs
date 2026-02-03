export interface ApiResponse<T> {
  success: boolean;
  message: string;
  error: ResponseError | null;
  data: T;
}

export interface ResponseError {
  code: string;
  message: string;
  status: number;
  details: Record<string, unknown>;
}
