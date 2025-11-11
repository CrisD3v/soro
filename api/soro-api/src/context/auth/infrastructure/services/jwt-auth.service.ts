import {
  AuthServicePort,
  LoginResult,
  RefreshTokenResult,
  TokenPayload,
} from '@context/auth/domain/ports/auth.service.port';
import { TokenRepositoryPort } from '@context/auth/domain/ports/token.repository.port';
import { UserRepositoryPort } from '@context/user/domain/ports/user.repository.port';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

@Injectable()
export class JwtAuthService implements AuthServicePort {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly userRepository: UserRepositoryPort,
    private readonly tokenRepository: TokenRepositoryPort,
  ) { }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return null;
    }

    return user;
  }

  async login(userId: string): Promise<LoginResult> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const roles = user.roles?.map((r) => r.roleId) || [];

    const payload: TokenPayload = {
      sub: user.id,
      email: user.email,
      companyId: user.companyId,
      roles,
    };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '15m',
    });

    const refreshToken = this.generateRefreshToken();
    const refreshTokenHash = this.hashToken(refreshToken);

    await this.tokenRepository.saveRefreshToken({
      userId: user.id,
      tokenHash: refreshTokenHash,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 días
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        lastName: user.lastName,
      },
    };
  }

  async refreshToken(refreshToken: string): Promise<RefreshTokenResult> {
    const tokenHash = this.hashToken(refreshToken);
    const storedToken = await this.tokenRepository.findRefreshToken(tokenHash);

    if (!storedToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    if (storedToken.expiresAt < new Date()) {
      await this.tokenRepository.deleteRefreshToken(tokenHash);
      throw new UnauthorizedException('Refresh token expired');
    }

    const user = await this.userRepository.findById(storedToken.userId);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Eliminar el token viejo
    await this.tokenRepository.deleteRefreshToken(tokenHash);

    // Generar nuevos tokens
    const roles = user.roles?.map((r) => r.roleId) || [];

    const payload: TokenPayload = {
      sub: user.id,
      email: user.email,
      companyId: user.companyId,
      roles,
    };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '15m',
    });

    const newRefreshToken = this.generateRefreshToken();
    const newRefreshTokenHash = this.hashToken(newRefreshToken);

    await this.tokenRepository.saveRefreshToken({
      userId: user.id,
      tokenHash: newRefreshTokenHash,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    return {
      accessToken,
      refreshToken: newRefreshToken,
    };
  }

  async logout(userId: string, refreshToken: string): Promise<void> {
    const tokenHash = this.hashToken(refreshToken);
    await this.tokenRepository.deleteRefreshToken(tokenHash);
  }

  async validateToken(token: string): Promise<TokenPayload> {
    try {
      return this.jwtService.verify(token);
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  private generateRefreshToken(): string {
    return crypto.randomBytes(64).toString('hex');
  }

  private hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }
}
