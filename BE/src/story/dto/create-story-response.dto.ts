import { Expose, Type } from 'class-transformer';

/**
 * Story Operation 타입
 */
export enum StoryOperationType {
  CREATED = 'created',
  UPDATED = 'updated',
  UNCHANGED = 'unchanged',
}

/**
 * Story Operation 메타데이터
 */
export class StoryOperationMeta {
  @Expose()
  operation: StoryOperationType;

  @Expose()
  isNewStory: boolean;

  @Expose()
  hasChanges: boolean;
}

/**
 * Story 기본 데이터
 */
export class StoryData {
  @Expose()
  id: bigint;

  @Expose()
  guid: string;

  @Expose()
  title: string;

  @Expose()
  createdAt: Date;
}

/**
 * Story 생성 응답 DTO
 */
export class CreateStoryResponseDto {
  @Expose()
  @Type(() => StoryData)
  story: StoryData;

  @Expose()
  @Type(() => StoryOperationMeta)
  meta: StoryOperationMeta;
}
