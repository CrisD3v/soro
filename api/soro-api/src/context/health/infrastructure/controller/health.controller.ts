import { HealthStatusResponseDto } from '@context/health/application/dto/health-response.dto';
import { SystemHealthService } from '@context/health/application/services/system-health.service';
import { HealthCheckUseCase } from '@context/health/application/use-cases/healt-check.case';
import { HealthStatus } from '@context/health/domain/health.service';
import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MetricsService } from '../../../../common/services/metrics.service';

const startTime = Date.now();

@ApiTags('Health & Metrics')
@Controller('health')
export class HealthController {
  constructor(
    private readonly healthCheckUseCase: HealthCheckUseCase,
    private readonly metricsService: MetricsService,
    private readonly systemHealthService: SystemHealthService,
    private readonly configService: ConfigService,
  ) { }

  @Get()
  @ApiOperation({ summary: 'Health check completo del sistema' })
  @ApiResponse({
    status: 200,
    description: 'Estado completo del sistema',
    type: HealthStatusResponseDto,
  })
  async check(): Promise<HealthStatusResponseDto> {
    const basicHealth = await this.healthCheckUseCase.execute();
    const systemHealth = this.systemHealthService.getSystemHealth();
    const uptime = Math.floor((Date.now() - startTime) / 1000);
    const version = this.configService.get('npm_package_version') || '2.0.0';

    // Determinar estado general basado en servicios
    let overallStatus: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';
    const services = [
      {
        name: 'Database',
        status: basicHealth.database === 'connected' ? 'up' : 'down',
        responseTime: 0,
        lastCheck: new Date().toISOString(),
        message: basicHealth.database === 'connected' ? 'Connected' : 'Disconnected',
      },
      {
        name: 'API Server',
        status: 'up',
        responseTime: 0,
        lastCheck: new Date().toISOString(),
        message: 'Running',
      },
    ];

    // Verificar si algún servicio crítico está caído
    const criticalDown = services.some((s) => s.name === 'Database' && s.status === 'down');
    if (criticalDown) {
      overallStatus = 'unhealthy';
    }

    return {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      uptime,
      version,
      services: services as any,
      system: systemHealth,
    };
  }

  @Get('ping')
  @ApiOperation({ summary: 'Ping simple para verificar que el servidor responde' })
  @ApiResponse({ status: 200, description: 'Pong' })
  async ping() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('basic')
  @ApiOperation({ summary: 'Health check básico (legacy)' })
  @ApiResponse({ status: 200, description: 'System health status' })
  async basicCheck(): Promise<HealthStatus> {
    return this.healthCheckUseCase.execute();
  }

  @Get('metrics')
  @ApiOperation({ summary: 'Obtener métricas de performance' })
  @ApiResponse({ status: 200, description: 'Performance metrics' })
  async getMetrics() {
    return {
      endpoints: this.metricsService.getMetrics(),
      summary: this.metricsService.getSummary(),
    };
  }
}
