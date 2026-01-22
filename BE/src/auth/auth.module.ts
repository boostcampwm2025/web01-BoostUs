import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { GithubAuthClient } from './github-auth.client';
import { AuthRepository } from './auth.repository';

@Module({
  imports: [HttpModule],
  controllers: [AuthController],
  providers: [AuthService, GithubAuthClient, AuthRepository],
})
export class AuthModule {}
