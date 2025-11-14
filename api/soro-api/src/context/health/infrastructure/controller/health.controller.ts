import { HealthCheckUseCase } from '@context/health/application/use-cases/healt-check.case';
import { HealthStatus } from '@context/health/domain/health.service';
import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MetricsService } from '../../../../common/services/metrics.service';

@ApiTags('Health & Metrics')
@Controller('health')
export class HealthController {
  constructor(
    private readonly healthCheckUseCase: HealthCheckUseCase,
    private readonly metricsService: MetricsService,
  ) { }

  @Get()
  @ApiOperation({ summary: 'Health check' })
  @ApiResponse({ status: 200, description: 'System health status' })
  async check(): Promise<HealthStatus> {
    return this.healthCheckUseCase.execute();
  }

  @Get('metrics')
  @ApiOperation({ summary: 'Get performance metrics' })
  @ApiResponse({ status: 200, description: 'Performance metrics' })
  async getMetrics() {
    return {
      endpoints: this.metricsService.getMetrics(),
      summary: this.metricsService.getSummary(),
    };
  }
}
