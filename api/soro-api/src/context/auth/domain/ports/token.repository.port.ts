export interface RefreshTokenData {
  userId: string;
  tokenHash: string;
  expiresAt: Date;
}

export abstract class TokenRepositoryPort {
  abstract saveRefreshToken(data: RefreshTokenData): Promise<void>;
  abstract findRefreshToken(tokenHash: string): Promise<RefreshTokenData | null>;
  abstract deleteRefreshToken(tokenHash: string): Promise<void>;
  abstract deleteAllUserTokens(userId: string): Promise<void>;
}
