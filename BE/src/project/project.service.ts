import { Injectable } from '@nestjs/common';

@Injectable()
export class ProjectService {
  getHello(): string {
    return 'Hello Projects!';
  }
}
