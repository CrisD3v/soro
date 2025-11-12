import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');

  // Configurar CORS para permitir cookies
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  });

  // Habilitar cookie-parser
  app.use(cookieParser());

  const PORT = process.env.PORT || 3000;
  await app.listen(PORT);

  Logger.log(`Servidor corriendo en: http://localhost:${PORT}/api`);
}
bootstrap();
