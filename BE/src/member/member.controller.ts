import { Body, Controller, Get, Patch } from '@nestjs/common';
import { ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentMember } from '../auth/decorator/current-member.decorator';
import { MemberProfileResponseDto } from './dto/member-profile-response.dto';
import { UpdateNicknameDto } from './dto/member-profile-update-nickname.dto';
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
  async getMyProfile(@CurrentMember() memberId: bigint): Promise<MemberProfileResponseDto> {
    return this.memberService.getProfile(memberId);
  }

  @Patch('me/profile/nickname')
  @ApiOperation({
    summary: '로그인한 사용자의 닉네임 수정',
    description: 'JWT 인증을 통해 로그인한 사용자의 닉네임을 수정합니다.',
  })
  @ApiConsumes('application/x-www-form-urlencoded')
  @ApiResponse({
    status: 200,
    description: '닉네임 수정 성공',
    type: MemberProfileResponseDto,
  })
  async updateMyNickname(
    @CurrentMember() memberId: bigint,
    @Body() dto: UpdateNicknameDto,
  ): Promise<MemberProfileResponseDto> {
    return this.memberService.updateMyNickname(memberId, dto);
  }
}
