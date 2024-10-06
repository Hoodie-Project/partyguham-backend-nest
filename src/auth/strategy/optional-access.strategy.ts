import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';

import { OauthService } from '../oauth.service';
import { AuthService } from '../auth.service';
import { PayloadType } from '../jwt.payload';

@Injectable()
export class OptionalAccessStrategy extends PassportStrategy(Strategy, 'optional-access') {
  constructor(
    private oauthService: OauthService,
    private authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_ACCESS_SECRET,
      ignoreExpiration: false,
      passReqToCallback: true, // req에 접근하기 위함
    });
  }

  async validate(req, payload: PayloadType) {
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);

    if (!token) {
      // 토큰이 없는 경우 요청을 통과시키기 위해 null을 반환
      return null;
    }

    // 토큰이 있는 경우 기존 로직대로 검증
    if (payload && payload.id) {
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
