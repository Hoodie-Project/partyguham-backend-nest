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
      secretOrKey: process.env.JWT_RECOVER_SECRET,
      ignoreExpiration: false,
    });
  }

  async validate(payload: PayloadType) {
    try {
      const oauthId = Number(this.authService.decrypt(payload.id));
      const oauth = await this.oauthService.findById(oauthId);
      console.log(oauth);
      if (!oauth || oauth.userId == null) {
        throw new UnauthorizedException('복구가 불가능한 계정입니다.', 'UNAUTHORIZED');
      }
      return { userId: oauth.userId, oauthId };
    } catch {
      throw new UnauthorizedException('Unauthorized', 'UNAUTHORIZED');
    }
  }
}
