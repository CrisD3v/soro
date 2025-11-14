import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
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

  // Validación global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('SORO API')
    .setDescription('Sistema SaaS Multi-tenant para gestión empresarial')
    .setVersion('2.0.0')
    .addTag('Auth', 'Autenticación y autorización')
    .addTag('Users', 'Gestión de usuarios')
    .addTag('Companies', 'Gestión de empresas')
    .addTag('Roles', 'Gestión de roles y permisos')
    .addTag('Permissions', 'Permisos del sistema')
    .addTag('Projects', 'Gestión de proyectos')
    .addTag('Tasks', 'Gestión de tareas')
    .addTag('Contacts', 'CRM - Gestión de contactos')
    .addTag('Deals', 'CRM - Pipeline de ventas')
    .addTag('Invoices', 'Facturación')
    .addTag('Notifications', 'Sistema de notificaciones')
    .addTag('Documents', 'Gestión de documentos')
    .addTag('Health', 'Health checks del sistema')
    .addBearerAuth()
    .addServer('http://localhost:3000', 'Desarrollo')
    .addServer('https://api.yourdomain.com', 'Producción')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'SORO API Documentation',
    customfavIcon: 'https://nestjs.com/img/logo-small.svg',
    customCss: '.swagger-ui .topbar { display: none }',
  });

  const PORT = process.env.PORT || 3000;
  await app.listen(PORT);

  Logger.log(`🚀 Servidor corriendo en: http://localhost:${PORT}/api`);
  Logger.log(`📚 Documentación Swagger: http://localhost:${PORT}/api/docs`);
  Logger.log(`🌐 CORS habilitado para: ${process.env.FRONTEND_URL}`);
}
bootstrap();
