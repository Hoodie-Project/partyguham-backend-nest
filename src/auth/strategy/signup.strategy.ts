import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';

import { OauthService } from '../oauth.service';
import { AuthService } from '../auth.service';
import { SignupPayloadType } from '../jwt.payload';

@Injectable()
export class SignupStrategy extends PassportStrategy(Strategy, 'signup') {
  constructor(
    private oauthService: OauthService,
    private authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(), // header bearer 확인
        (req: Request) => {
          return req.cookies['signupToken'] || null; // 쿠키 확인
        },
      ]),
      secretOrKey: process.env.JWT_SIGNUP_SECRET,
      ignoreExpiration: false,
      algorithms: ['HS256'],
    });
  }

  async validate(payload: SignupPayloadType) {
    const oauth = await this.oauthService.findById(payload.sub);

    if (!oauth) {
      throw new UnauthorizedException('OAuth 정보가 유효하지 않습니다.', 'UNAUTHORIZED');
    }

    if (oauth.userId) {
      throw new ConflictException('이미 회원가입이 되어있는 계정입니다.');
    }

    return { oauthId: oauth.id, email: payload.email, image: payload.image };
  }
}
