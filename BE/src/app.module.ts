import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HttpExceptionFilter } from './common/filter/http-exception.filter';
import { UnknownExceptionFilter } from './common/filter/unknown-exception.filter';
import { PrismaModule } from './prisma/prisma.module';
import { ProjectModule } from './project/project.module';
import { QuestionModule } from './question/question.module';
import { StoryModule } from './story/story.module';

@Module({
  imports: [
    PrismaModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    StoryModule,
    QuestionModule,
    ProjectModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    Logger,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: UnknownExceptionFilter,
    },
  ],
})
export class AppModule {}
