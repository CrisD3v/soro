import { AuthResponseDto, RefreshResponseDto } from '@context/auth/application/dto/auth-response.dto';
import { LoginDto } from '@context/auth/application/dto/login.dto';
import { RefreshTokenDto } from '@context/auth/application/dto/refresh-token.dto';
import { LoginUseCase } from '@context/auth/application/use-cases/login.use-case';
import { LogoutUseCase } from '@context/auth/application/use-cases/logout.use-case';
import { RefreshTokenUseCase } from '@context/auth/application/use-cases/refresh-token.use-case';
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
    private readonly logoutUseCase: LogoutUseCase,
  ) { }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto): Promise<AuthResponseDto> {
    return await this.loginUseCase.execute(dto);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Body() dto: RefreshTokenDto): Promise<RefreshResponseDto> {
    return await this.refreshTokenUseCase.execute(dto);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(
    @Request() req: any,
    @Body() dto: RefreshTokenDto,
  ): Promise<void> {
    await this.logoutUseCase.execute(req.user.sub, dto.refreshToken);
  }
}
