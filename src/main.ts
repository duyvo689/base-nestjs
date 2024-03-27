import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './configs/filters';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import {
  TransformInterceptor,
  TimeoutInterceptor,
} from './configs/interceptors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.enableCors();

  // GlobalPipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      exceptionFactory: (errors) => new BadRequestException(errors),
    }),
  );

  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalInterceptors(new TimeoutInterceptor());

  await app.listen(3000);
}
bootstrap();
