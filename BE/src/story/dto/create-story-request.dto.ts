import { Transform } from 'class-transformer';
import { IsDateString, IsNotEmpty, IsOptional, IsString } from 'class-validator';

/**
 * Story 생성 요청 DTO (크롤러용)
 */
export class CreateStoryRequestDto {
  @IsNotEmpty()
  @Transform(({ value }: { value: string }) => BigInt(value))
  feedId: bigint;

  @IsNotEmpty()
  @IsString()
  guid: string;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  summary?: string;

  @IsNotEmpty()
  @IsString()
  contents: string;

  @IsOptional()
  @IsString()
  thumbnailUrl?: string;

  @IsOptional()
  @IsString()
  originalUrl?: string;

  @IsNotEmpty()
  @IsDateString()
  publishedAt: Date;
}
