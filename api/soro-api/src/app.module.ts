import { AuthModule } from '@context/auth/auth.module';
import { CompanyModule } from '@context/company/company.module';
import { ContactModule } from '@context/contact/contact.module';
import { HealthModule } from '@context/health/health.module';
import { PermissionModule } from '@context/permission/permission.module';
import { ProjectModule } from '@context/project/project.module';
import { RoleModule } from '@context/role/role.module';
import { TaskModule } from '@context/task/task.module';
import { UserModule } from '@context/user/user.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule } from '@nestjs/throttler';
import { CustomRateLimitGuard } from './common/guards/rate-limit.guard';
import { CustomFieldModule } from './context/custom-field/custom-field.module';
import { DealModule } from './context/deal/deal.module';
import { DocumentModule } from './context/document/document.module';
import { EventModule } from './context/event/event.module';
import { InvoiceModule } from './context/invoice/invoice.module';
import { NotificationModule } from './context/notification/notification.module';
import { WorkflowModule } from './context/workflow/workflow.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 60 segundos
        limit: 100, // 100 requests por minuto (global)
      },
    ]),
    HealthModule,
    UserModule,
    AuthModule,
    CompanyModule,
    RoleModule,
    PermissionModule,
    ProjectModule,
    TaskModule,
    ContactModule,
    DealModule,
    InvoiceModule,
    NotificationModule,
    DocumentModule,
    EventModule,
    CustomFieldModule,
    WorkflowModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: CustomRateLimitGuard,
    },
  ],
})
export class AppModule { }
