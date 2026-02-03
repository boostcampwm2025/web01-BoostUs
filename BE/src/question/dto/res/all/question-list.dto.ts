import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { QuestionListItemDto } from './question-list-item.dto';
import { CursorMetaDto } from '../cursor-meta.dto';

export class QuestionCursorResponseDto {
  @ApiProperty({ type: () => [QuestionListItemDto] })
  @Expose()
  @Type(() => QuestionListItemDto)
  items!: QuestionListItemDto[];

  @ApiProperty({ type: () => CursorMetaDto })
  @Expose()
  @Type(() => CursorMetaDto)
  meta!: CursorMetaDto;
}
