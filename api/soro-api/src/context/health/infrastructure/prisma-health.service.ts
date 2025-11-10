import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import {
  HealthServicePort,
  HealthStatus,
} from '@context/health/domain/health.service';

@Injectable()
export class PrismaHealthService implements HealthServicePort {
  constructor(private readonly prisma: PrismaService) {}

  async checkHealth(): Promise<HealthStatus> {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return {
        status: 'ok',
        database: 'connected',
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      let errorMessage = 'Unknown error';

      if (typeof error === 'object' && error !== null && 'message' in error) {
        errorMessage = (error as { message: string }).message;
      }

      return {
        status: 'error',
        database: 'disconnected',
        timestamp: new Date().toISOString(),
        error: errorMessage,
      };
    }
  }
}
