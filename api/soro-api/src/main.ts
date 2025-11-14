import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { PerformanceInterceptor } from './common/interceptors/performance.interceptor';

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

  // Interceptors globales
  app.useGlobalInterceptors(
    new LoggingInterceptor(),
    new PerformanceInterceptor(),
  );

  // Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('SORO API')
    .setDescription(
      'Sistema SaaS Multi-tenant para gestión empresarial\n\n' +
      '## Características\n' +
      '- 🔐 Autenticación JWT con refresh tokens\n' +
      '- 🏢 Multi-tenant con aislamiento por companyId\n' +
      '- 👥 RBAC jerárquico con permisos granulares\n' +
      '- 📊 CRM completo con pipeline de ventas\n' +
      '- 💰 Sistema de facturación\n' +
      '- 📄 Gestión documental\n' +
      '- 🔔 Notificaciones en tiempo real\n' +
      '- 📅 Sistema de eventos\n' +
      '- 🎨 Campos personalizados dinámicos\n' +
      '- ⚙️ Automatización con workflows\n\n' +
      '## Rate Limiting\n' +
      '- Global: 100 requests/minuto\n' +
      '- Por tenant: Configurable en TenantConfig\n\n' +
      '## Autenticación\n' +
      'Todos los endpoints (excepto /auth/login) requieren Bearer token en el header Authorization'
    )
    .setVersion('2.0.0')
    .setContact('SORO Team', 'https://soro.com', 'support@soro.com')
    .setLicense('MIT', 'https://opensource.org/licenses/MIT')
    .addTag('Auth', 'Autenticación y autorización JWT')
    .addTag('Users', 'Gestión de usuarios y roles')
    .addTag('Companies', 'Gestión de empresas multi-tenant')
    .addTag('Roles', 'Gestión de roles jerárquicos')
    .addTag('Permissions', 'Permisos granulares del sistema')
    .addTag('Projects', 'Gestión de proyectos')
    .addTag('Tasks', 'Gestión de tareas con asignación')
    .addTag('Contacts', 'CRM - Gestión de contactos y leads')
    .addTag('Deals', 'CRM - Pipeline de ventas y oportunidades')
    .addTag('Invoices', 'Facturación y pagos')
    .addTag('Notifications', 'Sistema de notificaciones')
    .addTag('Documents', 'Gestión documental')
    .addTag('Events', 'Sistema de eventos asíncronos')
    .addTag('Custom Fields', 'Campos personalizados dinámicos')
    .addTag('Workflows', 'Automatización de procesos')
    .addTag('Health & Metrics', 'Health checks y métricas de performance')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .addServer('http://localhost:3000/api', 'Desarrollo')
    .addServer('https://api.yourdomain.com/api', 'Producción')
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
