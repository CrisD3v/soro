import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ThrottlerException, ThrottlerGuard } from '@nestjs/throttler';

@Injectable()
export class CustomRateLimitGuard extends ThrottlerGuard {
  constructor(
    protected readonly options: any,
    protected readonly storageService: any,
    protected readonly reflector: Reflector,
  ) {
    super(options, storageService, reflector);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    // Obtener companyId del usuario autenticado
    const user = request.user;
    const companyId = user?.companyId;

    // Usar companyId como parte de la key para rate limiting por tenant
    if (companyId) {
      const key = `${companyId}:${request.ip}:${request.path}`;
      request.throttlerKey = key;
    }

    try {
      return await super.canActivate(context);
    } catch (error) {
      if (error instanceof ThrottlerException) {
        throw new ThrottlerException('Too many requests. Please try again later.');
      }
      throw error;
    }
  }

  protected getTracker(req: Record<string, any>): Promise<string> {
    // Usar la key personalizada si existe
    if (req.throttlerKey) {
      return Promise.resolve(req.throttlerKey);
    }
    return Promise.resolve(req.ip);
  }
}
