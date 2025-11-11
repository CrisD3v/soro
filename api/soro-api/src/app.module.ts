import { AuthModule } from '@context/auth/auth.module';
import { CompanyModule } from '@context/company/company.module';
import { HealthModule } from '@context/health/health.module';
import { RoleModule } from '@context/role/role.module';
import { UserModule } from '@context/user/user.module';
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
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
