import { PaginatedDataDto } from '../../common/dto/pagination.dto';
import { StoryListItemDto } from './story-list-item.dto';

export type StoryListResponseDto = PaginatedDataDto<StoryListItemDto>;
