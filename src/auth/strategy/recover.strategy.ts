import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';

import { OauthService } from '../oauth.service';
import { AuthService } from '../auth.service';
import { PayloadType } from '../jwt.payload';

@Injectable()
export class RecoverStrategy extends PassportStrategy(Strategy, 'recover') {
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
    try {
      const oauthId = Number(this.authService.decrypt(payload.id));
      const oauth = await this.oauthService.findById(oauthId);

      if (!oauth || oauth.userId == null) {
        throw new UnauthorizedException('Unauthorized', 'UNAUTHORIZED');
      }
      return { userId: oauth.userId, oauthId };
    } catch {
      throw new UnauthorizedException('Unauthorized', 'UNAUTHORIZED');
    }
  }
}
