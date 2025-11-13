import { UserModule } from '@context/user/user.module';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { PrismaService } from '@prisma/prisma.service';
import { LoginUseCase } from './application/use-cases/login.use-case';
import { LogoutUseCase } from './application/use-cases/logout.use-case';
import { RefreshTokenUseCase } from './application/use-cases/refresh-token.use-case';
import { AuthServicePort } from './domain/ports/auth.service.port';
import { TokenRepositoryPort } from './domain/ports/token.repository.port';
import { AuthController } from './infrastructure/controllers/auth.controller';
import { PrismaTokenRepository } from './infrastructure/persistence/prisma-token.repository';
import { JwtAuthService } from './infrastructure/services/jwt-auth.service';
import { JwtStrategy } from './infrastructure/strategies/jwt.strategy';

@Module({
  imports: [
    UserModule,
    PassportModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') || 'your-secret-key',
        signOptions: { expiresIn: '15m' },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    PrismaService,
    JwtStrategy,
    PrismaTokenRepository,
    {
      provide: TokenRepositoryPort,
      useClass: PrismaTokenRepository,
    },
    JwtAuthService,
    {
      provide: AuthServicePort,
      useClass: JwtAuthService,
    },
    LoginUseCase,
    RefreshTokenUseCase,
    LogoutUseCase,
  ],
  exports: [AuthServicePort, JwtAuthService],
})
export class AuthModule {}
