import { AnswerResponseDto } from './answer-response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { Reaction } from 'src/enum/reaction';

export class AnswerDetailResponseDto extends AnswerResponseDto {
  @ApiProperty({ description: '답변에서 선택한 반응', example: Reaction.LIKE })
  @Expose()
  reaction?: Reaction;
}
