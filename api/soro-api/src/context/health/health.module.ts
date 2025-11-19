import { HealthCheckUseCase } from '@context/health/application/use-cases/healt-check.case';
import { HealthController } from '@context/health/infrastructure/controller/health.controller';
import { PrismaHealthService } from '@context/health/infrastructure/prisma-health.service';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from '@prisma/prisma.service';
import { MetricsService } from '../../common/services/metrics.service';
import { SystemHealthService } from './application/services/system-health.service';

@Module({
  imports: [ConfigModule],
  controllers: [HealthController],
  providers: [
    PrismaService,
    PrismaHealthService,
    HealthCheckUseCase,
    MetricsService,
    SystemHealthService,
    { provide: 'HealthServicePort', useExisting: PrismaHealthService },
  ],
  exports: [MetricsService],
})
export class HealthModule { }
