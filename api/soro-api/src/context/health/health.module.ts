import { HealthCheckUseCase } from '@context/health/application/use-cases/healt-check.case';
import { HealthController } from '@context/health/infrastructure/controller/health.controller';
import { PrismaHealthService } from '@context/health/infrastructure/prisma-health.service';
import { Module } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { MetricsService } from '../../common/services/metrics.service';

@Module({
  controllers: [HealthController],
  providers: [
    PrismaService,
    PrismaHealthService,
    HealthCheckUseCase,
    MetricsService,
    { provide: 'HealthServicePort', useExisting: PrismaHealthService },
  ],
  exports: [MetricsService],
})
export class HealthModule { }
