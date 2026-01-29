import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from '../auth/decorator/public.decorator';
import { responseMessage } from '../common/decorator/response-message.decorator';
import { LandingService } from './landing.service';
import { LandingDto } from './dto/landing.dto';

@ApiTags('랜딩')
@Controller('landing')
export class LandingController {
  constructor(private readonly landingService: LandingService) {}

  @Public()
  @Get('count')
  @responseMessage('랜딩 통계 조회 성공')
  @ApiOperation({
    summary: '랜딩 통계 조회',
    description: '멤버/스토리/프로젝트의 개수를 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '랜딩 통계 조회 성공',
    type: LandingDto,
  })
  @ApiResponse({
    status: 500,
    description: '랜딩 통계 조회 실패',
  })
  getLandingCount() {
    return this.landingService.findAll();
  }
}
