import { AuthServicePort } from '@context/auth/domain/ports/auth.service.port';
import { Injectable } from '@nestjs/common';

@Injectable()
export class LogoutUseCase {
  constructor(private readonly authService: AuthServicePort) {}

  async execute(userId: string, refreshToken: string): Promise<void> {
    await this.authService.logout(userId, refreshToken);
  }
}
