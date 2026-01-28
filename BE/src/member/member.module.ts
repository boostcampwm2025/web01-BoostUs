import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { MemberController } from './member.controller';
import { MemberRepository } from './member.repository';
import { MemberService } from './member.service';

@Module({
  imports: [PrismaModule],
  controllers: [MemberController],
  providers: [MemberService, MemberRepository],
  exports: [MemberService, MemberRepository],
})
export class MemberModule {}
