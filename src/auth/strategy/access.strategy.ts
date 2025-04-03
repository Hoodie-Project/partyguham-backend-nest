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
    try {
      const decryptOauthId = Number(this.authService.decrypt(payload.id));
      const oauth = await this.oauthService.findById(decryptOauthId);

      if (!oauth || oauth.userId == null) {
        throw new UnauthorizedException('OAuth 정보가 유효하지 않습니다.', 'UNAUTHORIZED');
      }
      return { id: oauth.userId };
    } catch {
      throw new UnauthorizedException('Unauthorized', 'UNAUTHORIZED');
    }
  }
}
