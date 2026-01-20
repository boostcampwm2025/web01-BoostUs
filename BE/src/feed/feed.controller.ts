import { Controller, Get } from '@nestjs/common';
import { FeedListResponseDto } from './dto';
import { FeedService } from './feed.service';

@Controller('feeds')
export class FeedController {
  constructor(private readonly feedService: FeedService) {}

  @Get()
  async getFeeds(): Promise<FeedListResponseDto> {
    return await this.feedService.findAllActiveFeeds();
  }
}
