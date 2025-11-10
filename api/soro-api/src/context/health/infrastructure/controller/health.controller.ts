import { Controller, Get } from '@nestjs/common';
import { HealthCheckUseCase } from '@context/health/application/use-cases/healt-check.case';
import { HealthStatus } from '@context/health/domain/health.service';

@Controller('health')
export class HealthController {
  constructor(private readonly healthCheckUseCase: HealthCheckUseCase) {}

  @Get()
  async check(): Promise<HealthStatus> {
    return this.healthCheckUseCase.execute();
  }
}
