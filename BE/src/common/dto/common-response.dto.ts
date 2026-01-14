export class CommonResponseDto<T = any> {
  success: boolean;
  message: string;
  error: null;
  data: T | null;
}
