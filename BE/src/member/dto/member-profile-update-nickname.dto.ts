import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class UpdateNicknameDto {
  @ApiProperty({ description: '변경할 닉네임', example: '연쇄조림마' })
  @IsString()
  @MinLength(2)
  @MaxLength(20)
  @Matches(/^[a-zA-Z0-9가-힣_]+$/, {
    message: '닉네임은 한글/영문/숫자/언더스코어(_)만 허용됩니다.',
  })
  nickname!: string;
}
