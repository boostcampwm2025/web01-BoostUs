import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from '../auth/decorator/public.decorator';
import { TechStackGroupedResponseDto } from './dto/tech-stack-response.dto';
import { TechStackService } from './tech-stack.service';

@ApiTags('기술 스택')
@Controller('tech-stacks')
export class TechStackController {
  constructor(private readonly techStackService: TechStackService) {}

  @Public()
  @Get()
  @ApiOperation({
    summary: '기술 스택 전체 조회',
    description: '등록된 모든 기술 스택을 카테고리별로 그룹화하여 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '기술 스택 조회 성공',
    type: TechStackGroupedResponseDto,
  })
  findAll() {
    return this.techStackService.findAll();
  }
}
