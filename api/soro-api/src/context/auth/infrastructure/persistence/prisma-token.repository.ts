import {
  RefreshTokenData,
  TokenRepositoryPort,
} from '@context/auth/domain/ports/token.repository.port';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';

@Injectable()
export class PrismaTokenRepository implements TokenRepositoryPort {
  constructor(private readonly prisma: PrismaService) { }

  async saveRefreshToken(data: RefreshTokenData): Promise<void> {
    await this.prisma.refreshToken.create({
      data: {
        userId: data.userId,
        tokenHash: data.tokenHash,
        expiresAt: data.expiresAt,
      },
    });
  }

  async findRefreshToken(tokenHash: string): Promise<RefreshTokenData | null> {
    const token = await this.prisma.refreshToken.findFirst({
      where: { tokenHash },
    });

    if (!token) return null;

    return {
      userId: token.userId,
      tokenHash: token.tokenHash,
      expiresAt: token.expiresAt,
    };
  }

  async deleteRefreshToken(tokenHash: string): Promise<void> {
    await this.prisma.refreshToken.deleteMany({
      where: { tokenHash },
    });
  }

  async deleteAllUserTokens(userId: string): Promise<void> {
    await this.prisma.refreshToken.deleteMany({
      where: { userId },
    });
  }
}
