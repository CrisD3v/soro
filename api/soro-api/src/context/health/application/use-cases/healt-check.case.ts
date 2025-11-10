import { Inject, Injectable } from '@nestjs/common';
import {
  HealthServicePort,
  HealthStatus,
} from '@context/health/domain/health.service';

@Injectable()
export class HealthCheckUseCase {
  constructor(
    @Inject('HealthServicePort')
    private readonly healthService: HealthServicePort,
  ) {}

  async execute(): Promise<HealthStatus> {
    return await this.healthService.checkHealth();
  }
}
