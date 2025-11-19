import {
  AuthResponseDto,
  RefreshResponseDto,
} from '@context/auth/application/dto/auth-response.dto';
import { LoginDto } from '@context/auth/application/dto/login.dto';
import { LoginUseCase } from '@context/auth/application/use-cases/login.use-case';
import { LogoutUseCase } from '@context/auth/application/use-cases/logout.use-case';
import { RefreshTokenUseCase } from '@context/auth/application/use-cases/refresh-token.use-case';
import { UserRepositoryPort } from '@context/user/domain/ports/user.repository.port';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import type { Request, Response } from 'express';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
    private readonly logoutUseCase: LogoutUseCase,
    private readonly configService: ConfigService,
    private readonly userRepository: UserRepositoryPort,
  ) { }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthResponseDto> {
    const result = await this.loginUseCase.execute(dto);

    const isProduction = this.configService.get('NODE_ENV') === 'production';

    // Establecer cookie accessToken
    res.cookie('accessToken', result.accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000, // 15 minutos
      path: '/',
    });

    // Establecer cookie refreshToken
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días
      path: '/',
    });

    // Retornar solo datos del usuario
    return {
      user: result.user,
    };
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<RefreshResponseDto> {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      throw new Error('Refresh token not found');
    }

    const result = await this.refreshTokenUseCase.execute({ refreshToken });

    const isProduction = this.configService.get('NODE_ENV') === 'production';

    // Establecer nuevas cookies
    res.cookie('accessToken', result.accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000,
      path: '/',
    });

    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/',
    });

    return {
      message: 'Tokens refreshed successfully',
    };
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    const refreshToken = req.cookies?.refreshToken;
    const user = (req as any).user;

    if (refreshToken) {
      await this.logoutUseCase.execute(user.sub, refreshToken);
    }

    // Limpiar cookies
    res.clearCookie('accessToken', { path: '/' });
    res.clearCookie('refreshToken', { path: '/' });
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Obtener usuario autenticado',
    description: 'Retorna la información del usuario autenticado usando el JWT del accessToken',
  })
  @ApiResponse({
    status: 200,
    description: 'Usuario autenticado obtenido exitosamente',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid' },
        email: { type: 'string', format: 'email' },
        name: { type: 'string' },
        lastName: { type: 'string' },
        fullName: { type: 'string' },
        documentNumber: { type: 'string' },
        documentType: { type: 'string', enum: ['CC', 'CE', 'TI', 'NIT', 'PASSPORT'] },
        phone: { type: 'string' },
        companyId: { type: 'string', format: 'uuid' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'No autorizado - Token inválido' })
  async getMe(@Req() req: Request) {
    const user = (req as any).user;
    const userId = user.sub;

    // Obtener datos completos del usuario
    const fullUser = await this.userRepository.findById(userId);

    if (!fullUser) {
      throw new Error('User not found');
    }

    // Retornar solo los datos necesarios (sin password)
    return {
      id: fullUser.id,
      email: fullUser.email,
      name: fullUser.name,
      lastName: fullUser.lastName,
      fullName: `${fullUser.name} ${fullUser.lastName}`,
      documentNumber: fullUser.documentNumber,
      documentType: fullUser.documentType,
      phone: fullUser.phone,
      companyId: fullUser.companyId,
    };
  }
}
