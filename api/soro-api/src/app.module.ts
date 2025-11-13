import { AuthModule } from '@context/auth/auth.module';
import { CompanyModule } from '@context/company/company.module';
import { ContactModule } from '@context/contact/contact.module';
import { HealthModule } from '@context/health/health.module';
import { PermissionModule } from '@context/permission/permission.module';
import { ProjectModule } from '@context/project/project.module';
import { RoleModule } from '@context/role/role.module';
import { TaskModule } from '@context/task/task.module';
import { UserModule } from '@context/user/user.module';
import { DealModule } from './context/deal/deal.module';
import { InvoiceModule } from './context/invoice/invoice.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

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
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
