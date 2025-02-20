import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';

import { OauthService } from '../oauth.service';
import { AuthService } from '../auth.service';
import { PayloadType } from '../jwt.payload';

@Injectable()
export class AccessStrategy extends PassportStrategy(Strategy, 'access') {
  constructor(
    private oauthService: OauthService,
    private authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_ACCESS_SECRET,
      ignoreExpiration: false,
    });
  }

  async validate(payload: PayloadType) {
    if (!payload) {
      throw new UnauthorizedException('Unauthorized: Invalid or missing token', 'UNAUTHORIZED');
    }

    if (payload.id) {
      const decryptUserId = Number(this.authService.decrypt(payload.id));
      const oauth = await this.oauthService.findById(decryptUserId);
      const userId = oauth.userId;

      if (!userId) {
        throw new UnauthorizedException('필수 회원가입이 필요합니다.', 'UNAUTHORIZED');
      } else {
        return { id: userId };
      }
    } else {
      throw new UnauthorizedException('Unauthorized', 'UNAUTHORIZED');
    }
  }
}
