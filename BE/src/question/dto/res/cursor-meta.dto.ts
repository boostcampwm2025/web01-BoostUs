import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class CursorMetaDto {
  @ApiProperty({ description: '요청한 페이지 크기', example: 10 })
  @Expose()
  size!: number;

  @ApiProperty({ description: '다음 페이지 존재 여부', example: true })
  @Expose()
  hasNext!: boolean;

  @ApiProperty({ description: '다음 커서', example: 'eyJ...', nullable: true })
  @Expose()
  nextCursor!: string | null;

  @ApiProperty({ description: '이전 커서(=요청에 쓰인 커서)', example: 'eyJ...', nullable: true })
  @Expose()
  prevCursor!: string | null;
}
