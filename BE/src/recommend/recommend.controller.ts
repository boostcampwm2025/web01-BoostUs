import { Controller, Get } from '@nestjs/common';
import { RecommendService } from './recommend.service';
import { Public } from 'src/auth/decorator/public.decorator';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ProjectRecommendDto } from './dto/recomment-item.dto';

@ApiTags('추천 프로젝트')
@Controller('recommend')
export class RecommendController {
  constructor(private readonly recommendService: RecommendService) {}

  @Public()
  @Get()
  @ApiOperation({
    summary: '추천 프로젝트 조회',
    description: '추천 프로젝트 리스트를 불러옵니다.',
  })
  @ApiResponse({
    status: 200,
    description: '프로젝트 추천 조회 성공',
    type: [ProjectRecommendDto],
  })
  async getRecommendData() {
    return await this.recommendService.getRecommend();
  }
}
