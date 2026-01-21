import { ApiProperty } from '@nestjs/swagger';
import { AnswerUserDto } from './answer-user.dto';

export class AnswerUpdateResponseDto {
  @ApiProperty({
    description: '답변 ID',
    example: 101,
  })
  id!: number;

  @ApiProperty({
    description: '답변 내용',
    example: '도메인 기준으로 모듈을 분리하고, 공통 로직은 shared 모듈로 분리하는 것이 좋습니다.',
  })
  content!: string;

  @ApiProperty({
    description: '채택 여부',
    example: false,
  })
  isAccepted!: boolean;

  @ApiProperty({
    description: '좋아요 수',
    example: 3,
  })
  likeCount!: number;

  @ApiProperty({
    description: '수정 일시',
    example: '2025-12-17T12:20:00Z',
  })
  updatedAt!: string;

  @ApiProperty({
    description: '작성자 정보',
    type: () => AnswerUserDto,
  })
  user!: AnswerUserDto;
}
