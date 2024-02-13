import { Controller, Headers, Post, UnauthorizedException, UseGuards } from '@nestjs/common';
import { CurrentAccount } from 'src/common/decorators/auth.decorator';
import { RefreshJwtAuthGuard } from 'src/common/guard/jwt.guard';
import { AuthService } from './auth.service';
import { DecodedPayload } from './jwt.payload';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(RefreshJwtAuthGuard)
  @Post('refresh-token')
  async refreshTokens(@Headers('authorization') authorization: string, @CurrentAccount() account: DecodedPayload) {
    const [, token] = authorization.split(' ');

    const findRefreshToken = await this.authService.findRefreshToken(account.id, token);
    if (token !== findRefreshToken.refreshToken) {
      throw new UnauthorizedException('Unauthorized');
    }

    const id = await this.authService.encrypt(String(account.id));
    const accessToken = await this.authService.createAccessToken(id);

    return { accessToken };
  }
}
