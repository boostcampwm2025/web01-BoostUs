import { ApiProperty } from '@nestjs/swagger';

class TechStackBasicDto {
  @ApiProperty({
    description: '기술 스택 ID',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: '기술 스택 이름',
    example: 'React',
  })
  name: string;
}

export class TechStackGroupedResponseDto {
  @ApiProperty({
    description: '프론트엔드 기술 스택 목록',
    type: [TechStackBasicDto],
    required: false,
  })
  FRONTEND?: TechStackBasicDto[];

  @ApiProperty({
    description: '백엔드 기술 스택 목록',
    type: [TechStackBasicDto],
    required: false,
  })
  BACKEND?: TechStackBasicDto[];

  @ApiProperty({
    description: '데이터베이스 기술 스택 목록',
    type: [TechStackBasicDto],
    required: false,
  })
  DATABASE?: TechStackBasicDto[];

  @ApiProperty({
    description: '인프라 기술 스택 목록',
    type: [TechStackBasicDto],
    required: false,
  })
  INFRA?: TechStackBasicDto[];

  @ApiProperty({
    description: '모바일 기술 스택 목록',
    type: [TechStackBasicDto],
    required: false,
  })
  MOBILE?: TechStackBasicDto[];

  @ApiProperty({
    description: '기타 기술 스택 목록',
    type: [TechStackBasicDto],
    required: false,
  })
  ETC?: TechStackBasicDto[];
}
