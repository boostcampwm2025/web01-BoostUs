import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class CreateAnswerDto {
  @ApiProperty({
    description: '답변 내용 (마크다운)',
    example: '# 답변\n\n그정도는 알아서 하셔야죠',
    minLength: 1,
  })
  @IsString()
  @MinLength(1)
  contents!: string; // markdown
}
