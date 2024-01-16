import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app';
import { ConfigService } from '@nestjs/config';
import {
  ClassSerializerInterceptor,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { setupSwagger } from './util';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const PORT = +configService.get<number>('PORT');

  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  if (configService.get<string>('NODE_ENV') === 'development') {
    setupSwagger(app);
  }

  process.env.TZ = configService.get<string>('TIMEZONE');

  await app.listen(PORT);
}

bootstrap();
