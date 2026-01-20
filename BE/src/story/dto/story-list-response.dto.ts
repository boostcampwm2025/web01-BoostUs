import { ApiProperty } from '@nestjs/swagger';
import { PaginatedDataDto } from '../../common/dto/pagination.dto';
import { StoryListItemDto } from './story-list-item.dto';

/**
 * Story 목록 조회 응답 DTO
 */
export class StoryListResponseDto extends PaginatedDataDto<StoryListItemDto> {
  @ApiProperty({
    description: '스토리 목록',
    type: [StoryListItemDto],
  })
  declare items: StoryListItemDto[];
}
