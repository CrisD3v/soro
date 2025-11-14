import { SetMetadata } from '@nestjs/common';

export const RATE_LIMIT_KEY = 'rateLimit';

export interface RateLimitOptions {
  ttl: number; // Time to live in seconds
  limit: number; // Number of requests
}

export const RateLimit = (options: RateLimitOptions) =>
  SetMetadata(RATE_LIMIT_KEY, options);

// Decoradores predefinidos para casos comunes
export const RateLimitStrict = () => RateLimit({ ttl: 60, limit: 10 }); // 10 req/min
export const RateLimitModerate = () => RateLimit({ ttl: 60, limit: 30 }); // 30 req/min
export const RateLimitRelaxed = () => RateLimit({ ttl: 60, limit: 100 }); // 100 req/min
