import { ApiProperty } from '@nestjs/swagger';

export class QuestionCountDto {
  @ApiProperty({
    description: '전체 질문 갯수',
    example: '1',
  })
  total: string; // BigInt → string

  @ApiProperty({
    description: '답변이 없는 질문 갯수',
    example: '5',
  })
  noAnswer!: string;

  @ApiProperty({
    description: '답변은 있지만 채택되지 않은 질문 갯수',
    example: '10',
  })
  unsolved!: string;

  @ApiProperty({
    description: '채택된 답변이 있는 질문 갯수',
    example: '5',
  })
  solved!: string;
}
