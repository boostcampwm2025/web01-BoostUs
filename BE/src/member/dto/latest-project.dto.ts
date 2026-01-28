import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class LatestProjectDto {
  @ApiProperty({
    description: '프로젝트 이름',
    example: '부스트캠프 팀 프로젝트',
    nullable: true,
  })
  @Expose()
  title: string | null;

  @ApiProperty({
    description: '팀 이름',
    example: '슈퍼팀',
    nullable: true,
  })
  @Expose()
  teamName: string | null;

  @ApiProperty({
    description: '분야',
    example: 'WEB',
    nullable: true,
  })
  @Expose()
  field: string | null;
}
