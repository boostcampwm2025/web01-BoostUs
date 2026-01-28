import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { RedisModule } from '../redis/redis.module';
import { AuthController } from './auth.controller';
import { AuthRepository } from './auth.repository';
import { AuthService } from './auth.service';
import { GithubAuthClient } from './github-auth.client';
import { AuthGuard } from './guard/auth.guard';

@Module({
  imports: [
    HttpModule,
    RedisModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.getOrThrow('JWT_SECRET'),
        signOptions: {
          expiresIn: config.getOrThrow('JWT_ACCESS_EXPIRES_IN'), // 기본 expiresIn 설정 (각 토큰 생성 시 expiresIn을 개별적으로 오버라이드)
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, GithubAuthClient, AuthRepository, AuthGuard],
  exports: [AuthGuard, JwtModule],
})
export class AuthModule { }
