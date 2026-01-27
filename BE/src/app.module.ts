import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { AnswerModule } from './answer/answer.module';
import { AuthModule } from './auth/auth.module';
import { AuthGuard } from './auth/guard/auth.guard';
import { HttpExceptionFilter } from './common/filter/http-exception.filter';
import { UnknownExceptionFilter } from './common/filter/unknown-exception.filter';
import { FeedModule } from './feed/feed.module';
import { PrismaModule } from './prisma/prisma.module';
import { ProjectModule } from './project/project.module';
import { QuestionModule } from './question/question.module';
import { StoryModule } from './story/story.module';
import { TechStackModule } from './tech-stack/tech-stack.module';

@Module({
  imports: [
    PrismaModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    FeedModule,
    StoryModule,
    QuestionModule,
    ProjectModule,
    TechStackModule,
    AuthModule,
    AnswerModule,
  ],
  providers: [
    Logger,
    // 전역 가드 등록
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    // 순서 중요: 역순으로 체크되므로 구체적인 필터를 나중에 등록
    {
      provide: APP_FILTER,
      useClass: UnknownExceptionFilter, // 모든 예외 처리 (fallback)
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter, // HttpException 처리 (우선)
    },
  ],
})
export class AppModule { }
