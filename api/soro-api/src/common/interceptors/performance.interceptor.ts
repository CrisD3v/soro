import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class PerformanceInterceptor implements NestInterceptor {
  private readonly logger = new Logger('Performance');
  private readonly slowThreshold = 1000; // 1 segundo

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url } = request;
    const now = Date.now();

    return next.handle().pipe(
      tap(() => {
        const responseTime = Date.now() - now;

        // Log solo si es lento
        if (responseTime > this.slowThreshold) {
          this.logger.warn({
            message: 'Slow request detected',
            method,
            url,
            responseTime: `${responseTime}ms`,
            threshold: `${this.slowThreshold}ms`,
          });
        }

        // Métricas adicionales
        this.recordMetrics(method, url, responseTime);
      }),
    );
  }

  private recordMetrics(method: string, url: string, responseTime: number): void {
    // Aquí se pueden enviar métricas a Prometheus, DataDog, etc.
    // Por ahora solo guardamos en memoria para demostración
    const key = `${method}:${url}`;

    if (!(global as any).metrics) {
      (global as any).metrics = {};
    }

    if (!(global as any).metrics[key]) {
      (global as any).metrics[key] = {
        count: 0,
        totalTime: 0,
        avgTime: 0,
        minTime: Infinity,
        maxTime: 0,
      };
    }

    const metrics = (global as any).metrics[key];
    metrics.count++;
    metrics.totalTime += responseTime;
    metrics.avgTime = metrics.totalTime / metrics.count;
    metrics.minTime = Math.min(metrics.minTime, responseTime);
    metrics.maxTime = Math.max(metrics.maxTime, responseTime);
  }
}
