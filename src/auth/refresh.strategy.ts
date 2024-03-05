import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';

import { OauthService } from './oauth.service';
import { AuthService } from './auth.service';

@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy, 'refresh') {
  constructor(
    private authService: AuthService,
    private oauthService: OauthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_REFRESH_SECRET,
      ignoreExpiration: false,
    });
  }

  async validate(payload: { id: string; iat: number; exp: number }): Promise<{
    userId: number;
  }> {
    if (payload.id) {
      const decryptUserId = Number(this.authService.decrypt(payload.id));

      return { userId: decryptUserId };
    } else {
      throw new UnauthorizedException('Unauthorized');
    }
  }
}
