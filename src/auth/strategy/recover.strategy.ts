import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';

import { OauthService } from '../oauth.service';
import { AuthService } from '../auth.service';
import { RecoverPayloadType } from '../jwt.payload';

@Injectable()
export class RecoverStrategy extends PassportStrategy(Strategy, 'recover') {
  constructor(
    private oauthService: OauthService,
    private authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(), // header bearer 확인
        (req: Request) => {
          return req.cookies['recoverToken'] || null; // 쿠키 확인
        },
      ]),
      secretOrKey: process.env.JWT_RECOVER_SECRET,
      ignoreExpiration: false,
    });
  }

  async validate(payload: RecoverPayloadType) {
    const oauth = await this.oauthService.findById(payload.sub);

    if (!oauth || oauth.userId == null) {
      throw new UnauthorizedException('복구가 불가능한 계정입니다.', 'UNAUTHORIZED');
    }

    return { userId: oauth.userId, oauthId: oauth.id };
  }
}
