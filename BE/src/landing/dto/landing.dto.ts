import { ApiProperty } from '@nestjs/swagger';

export class LandingDto {
  @ApiProperty({
    description: '전체 질문 갯수',
    example: '1',
  })
  membercnt: string;

  @ApiProperty({
    description: '전체 프로잭트 갯수',
    example: '5',
  })
  projectcnt: string;

  @ApiProperty({
    description: '전체 이야기 갯수',
    example: '10',
  })
  storycnt: string;
}
