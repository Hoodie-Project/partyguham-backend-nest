import { Body, Controller, Get, Headers, Post, UnauthorizedException, UseGuards } from '@nestjs/common';
import { CurrentUser, CurrentUserType } from 'src/common/decorators/auth.decorator';
import { RefreshJwtAuthGuard } from 'src/common/guard/jwt.guard';
import { AuthService } from './auth.service';
import { ApiCookieAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiCookieAuth('refreshToken')
  @UseGuards(RefreshJwtAuthGuard)
  @ApiOperation({ summary: 'accessToken 재발급' })
  @Post('access-token')
  async refreshTokens(@CurrentUser() user: CurrentUserType) {
    const id = await this.authService.encrypt(String(user.id));
    const accessToken = await this.authService.createAccessToken(id);

    return { accessToken };
  }

  @ApiOperation({ summary: 'accessToken 재발급' })
  @Post('encrypt')
  async encrypt(@Body('data') body) {
    const appEncrypt = await this.authService.appEncrypt(String(body));
    const appDecrypt = await this.authService.appDecrypt(appEncrypt);

    return { appEncrypt, appDecrypt };
  }
}
