import { HttpException } from '@nestjs/common';

export class CustomException extends HttpException {
  constructor(error: { code: string; message: string; status: number }) {
    super(
      {
        code: error.code,
        message: error.message,
      },
      error.status,
    );
  }
}
