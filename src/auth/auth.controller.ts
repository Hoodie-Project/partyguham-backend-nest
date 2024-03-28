import { Controller, Get, Headers, Post, UnauthorizedException, UseGuards } from '@nestjs/common';
import { CurrentUser, CurrentUserType } from 'src/common/decorators/auth.decorator';
import { RefreshJwtAuthGuard } from 'src/common/guard/jwt.guard';
import { AuthService } from './auth.service';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiCookieAuth('refreshToken')
  @UseGuards(RefreshJwtAuthGuard)
  @Post('access-token')
  async refreshTokens(@CurrentUser() user: CurrentUserType) {
    const id = await this.authService.encrypt(String(user.id));
    const accessToken = await this.authService.createAccessToken(id);

    return { accessToken };
  }
}
