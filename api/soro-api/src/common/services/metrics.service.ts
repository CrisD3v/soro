import { Injectable, Logger } from '@nestjs/common';

export interface Metric {
  count: number;
  totalTime: number;
  avgTime: number;
  minTime: number;
  maxTime: number;
}

@Injectable()
export class MetricsService {
  private readonly logger = new Logger(MetricsService.name);

  getMetrics(): Record<string, Metric> {
    return (global as any).metrics || {};
  }

  getMetricsByEndpoint(endpoint: string): Metric | null {
    const metrics = this.getMetrics();
    return metrics[endpoint] || null;
  }

  getSummary(): {
    totalRequests: number;
    avgResponseTime: number;
    slowestEndpoint: { endpoint: string; time: number } | null;
    fastestEndpoint: { endpoint: string; time: number } | null;
  } {
    const metrics = this.getMetrics();
    const endpoints = Object.keys(metrics);

    if (endpoints.length === 0) {
      return {
        totalRequests: 0,
        avgResponseTime: 0,
        slowestEndpoint: null,
        fastestEndpoint: null,
      };
    }

    let totalRequests = 0;
    let totalTime = 0;
    let slowest = { endpoint: '', time: 0 };
    let fastest = { endpoint: '', time: Infinity };

    endpoints.forEach((endpoint) => {
      const metric = metrics[endpoint];
      totalRequests += metric.count;
      totalTime += metric.totalTime;

      if (metric.avgTime > slowest.time) {
        slowest = { endpoint, time: metric.avgTime };
      }

      if (metric.avgTime < fastest.time) {
        fastest = { endpoint, time: metric.avgTime };
      }
    });

    return {
      totalRequests,
      avgResponseTime: totalTime / totalRequests,
      slowestEndpoint: slowest.time > 0 ? slowest : null,
      fastestEndpoint: fastest.time < Infinity ? fastest : null,
    };
  }

  resetMetrics(): void {
    (global as any).metrics = {};
    this.logger.log('Metrics reset');
  }
}
