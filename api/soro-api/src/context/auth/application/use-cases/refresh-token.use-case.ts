import { AuthServicePort } from '@context/auth/domain/ports/auth.service.port';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class RefreshTokenUseCase {
  constructor(private readonly authService: AuthServicePort) {}

  async execute(dto: { refreshToken: string }) {
    try {
      return await this.authService.refreshToken(dto.refreshToken);
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
