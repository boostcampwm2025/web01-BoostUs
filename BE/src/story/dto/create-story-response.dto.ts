import { Expose } from 'class-transformer';

/**
 * Story 생성 응답 DTO
 */
export class CreateStoryResponseDto {
  @Expose()
  id: bigint;

  @Expose()
  guid: string;

  @Expose()
  title: string;

  @Expose()
  createdAt: Date;
}
