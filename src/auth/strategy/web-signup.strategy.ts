import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { OauthService } from '../oauth.service';
import { AuthService } from '../auth.service';
import { PayloadType } from '../jwt.payload';

@Injectable()
export class WebSignupStrategy extends PassportStrategy(Strategy, 'signup') {
  constructor(
    private oauthService: OauthService,
    private authService: AuthService,
  ) {
    super({
      jwtFromRequest: (request: Request) => {
        if (request && request.cookies) {
          const signupToken = request.cookies['signupToken'];
          if (!signupToken) throw new UnauthorizedException('signupToken이 cookies에 없습니다.', 'UNAUTHORIZED');
          return signupToken;
        }
      },
      secretOrKey: process.env.JWT_SIGNUP_SECRET,
      ignoreExpiration: false,
      algorithms: ['HS256'],
    });
  }

  async validate(payload: PayloadType) {
    if (payload.id) {
      const decryptUserId = Number(this.authService.decrypt(payload.id));
      const oauth = await this.oauthService.findById(decryptUserId);
      const oauthId = oauth.id;

      if (oauth.userId) {
        throw new ConflictException('이미 회원가입이 되어있는 계정입니다.');
      }

      return { oauthId };
    } else {
      throw new UnauthorizedException('Unauthorized', 'UNAUTHORIZED');
    }
  }
}
