import { Controller, Headers, Post, UnauthorizedException, UseGuards } from '@nestjs/common';
import { CurrentUser, CurrentUserType } from 'src/common/decorators/auth.decorator';
import { RefreshJwtAuthGuard } from 'src/common/guard/jwt.guard';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(RefreshJwtAuthGuard)
  @Post('access-token')
  async refreshTokens(@Headers('authorization') authorization: string, @CurrentUser() user: CurrentUserType) {
    const [, token] = authorization.split(' ');

    const findRefreshToken = await this.authService.findRefreshToken(user.id, token);
    if (token !== findRefreshToken.refreshToken) {
      throw new UnauthorizedException('Unauthorized');
    }

    const id = await this.authService.encrypt(String(user.id));
    const accessToken = await this.authService.createAccessToken(id);

    return { accessToken };
  }
}
