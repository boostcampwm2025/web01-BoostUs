export class ExceptionResponseDto {
  success: false;
  error: ErrorDetailDto;
  data: null;
}

export interface ErrorDetailDto {
  code: string;
  message: string;
  status: number;
  details?: unknown;
}
