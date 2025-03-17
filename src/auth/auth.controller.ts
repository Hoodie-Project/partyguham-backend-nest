import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CurrentRefreshType, CurrentUser } from 'src/common/decorators/auth.decorator';
import { RefreshJwtAuthGuard } from 'src/common/guard/jwt.guard';
import { AuthService } from './auth.service';
import { ApiCookieAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('auth (인증)')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiCookieAuth('refreshToken')
  @UseGuards(RefreshJwtAuthGuard)
  @ApiOperation({ summary: 'accessToken 재발급' })
  @Post('access-token')
  async refreshTokens(@CurrentUser() refresh: CurrentRefreshType) {
    const accessToken = await this.authService.createAccessToken(refresh.oauthId);

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
      const accessToken = await this.authService.createAccessToken(1);
      const refreshToken = await this.authService.createRefreshToken(1);
      const singupToken = await this.authService.signupAccessToken(1, 'email', 'image');

      return { accessToken, refreshToken, singupToken };
    } else {
      return null;
    }
  }
}
