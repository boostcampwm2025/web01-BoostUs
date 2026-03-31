import { IsNotEmpty, IsString } from 'class-validator';

export class MobileCompleteRequestDto {
  @IsNotEmpty()
  @IsString()
  code: string;
}
