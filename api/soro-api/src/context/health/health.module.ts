import { Module } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { HealthCheckUseCase } from '@context/health/application/use-cases/healt-check.case';
import { HealthController } from '@context/health/infrastructure/controller/health.controller';
import { PrismaHealthService } from '@context/health/infrastructure/prisma-health.service';

@Module({
  controllers: [HealthController],
  providers: [
    PrismaService,
    PrismaHealthService,
    HealthCheckUseCase,
    { provide: 'HealthServicePort', useExisting: PrismaHealthService },
  ],
})
export class HealthModule {}
