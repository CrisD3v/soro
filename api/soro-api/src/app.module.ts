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
import { DealModule } from './context/deal/deal.module';
import { DocumentModule } from './context/document/document.module';
import { InvoiceModule } from './context/invoice/invoice.module';
import { NotificationModule } from './context/notification/notification.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
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
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
