import { IsString, IsNotEmpty } from 'class-validator';

/**
 * callback 에서 쿼리 파라미터로 일회용 인가 code 받는 DTO 입니당
 */
export class GithubCallbackQueryDto {
  @IsNotEmpty()
  @IsString()
  code: string;
}
