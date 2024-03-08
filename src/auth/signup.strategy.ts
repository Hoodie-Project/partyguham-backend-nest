import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';

import { OauthService } from './oauth.service';
import { AuthService } from './auth.service';
import { PayloadType } from './jwt.payload';

@Injectable()
export class SignupStrategy extends PassportStrategy(Strategy, 'signup') {
  constructor(
    private oauthService: OauthService,
    private authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SIGNUP_SECRET,
      ignoreExpiration: false,
    });
  }

  async validate(payload: PayloadType) {
    if (payload.id) {
      const decryptUserId = Number(this.authService.decrypt(payload.id));
      const oauth = await this.oauthService.findById(decryptUserId);
      const oauthId = oauth.id;

      return { oauthId };
    } else {
      throw new UnauthorizedException('Unauthorized');
    }
  }
}
