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

  @Post('encrypt')
  @ApiOperation({ summary: '암호화 체크' })
  async encrypt(@Body('data') body) {
    const appEncrypt = await this.authService.appEncrypt(String(body));
    const appDecrypt = await this.authService.appDecrypt(appEncrypt);

    return { appEncrypt, appDecrypt };
  }

  @ApiOperation({ summary: 'admin access token' })
  @Post('admin/token')
  async adminToken() {
    if (process.env.MODE_ENV !== 'prod') {
      const id = await this.authService.encrypt(String(1));
      const accessToken = await this.authService.createAccessToken(id);
      const singupToken = await this.authService.signupAccessToken(id);

      return { accessToken, singupToken };
    } else {
      return null;
    }
  }
}
