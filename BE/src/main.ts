import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

// BigInt 전역 설정 (JSON.stringify 시 문자열로 변환)
(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
