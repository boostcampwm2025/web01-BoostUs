import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentMember } from '../auth/decorator/current-member.decorator';
import { MemberProfileResponseDto } from './dto/member-profile-response.dto';
import { MemberService } from './member.service';

@ApiTags('멤버')
@Controller('members')
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  @Get('me/profile')
  @ApiOperation({
    summary: '로그인한 사용자 마이페이지 조회',
    description: 'JWT 인증을 통해 로그인한 사용자의 마이페이지 정보를 반환합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '마이페이지 정보 조회 성공',
    type: MemberProfileResponseDto,
  })
  async getMyProfile(@CurrentMember() memberId: string): Promise<MemberProfileResponseDto> {
    return this.memberService.getProfile(memberId);
  }
}
