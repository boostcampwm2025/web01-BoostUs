import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ResponseInterceptor } from './common/interceptor/response.interceptor';

// BigInt 전역 설정 (JSON.stringify 시 문자열로 변환)
(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  // CORS 설정
  app.enableCors({
    origin: ['http://localhost:5173'],
    credentials: true,
  });

  // 응답 인터셉터 적용
  app.useGlobalInterceptors(new ResponseInterceptor());

  // 유효성 검사 파이프 적용
  // transform: true - 요청 데이터를 클래스 인스턴스로 자동 변환
  // whitelist: true - 요청 데이터에서 정의되지 않은 필드 제거
  // forbidNonWhitelisted: true - 요청 데이터에서 정의되지 않은 필드가 있으면 에러 발생
  // disableErrorMessages: false - 에러 메시지 표시 (프로덕션 환경에서는 true로 설정 필요)
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      disableErrorMessages: false,
    }),
  );

  // 스웨거 설정
  const config = new DocumentBuilder().setTitle('BoostUs API').setDescription('BoostUs API Description').setVersion('1.0').build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
