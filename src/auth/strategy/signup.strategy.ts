import { Strategy } from 'passport-jwt';
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
      jwtFromRequest: (request: Request) => {
        const signupToken = request?.cookies?.['signupToken'];
        const authHeader = request?.headers?.authorization;

        if (signupToken && authHeader) {
          throw new UnauthorizedException('쿠키와 Authorization 헤더가 동시에 존재합니다.', 'UNAUTHORIZED');
        }

        // 쿠키에 토큰이 있으면 사용
        if (signupToken) {
          return signupToken;
        }

        // Authorization 헤더에 Bearer 토큰이 있으면 사용
        if (authHeader?.startsWith('Bearer ')) {
          return authHeader.split(' ')[1]; // "Bearer" 다음의 토큰 반환
        }

        // 둘 다 없을 경우 UnauthorizedException 발생
        throw new UnauthorizedException('signupToken이 cookies 또는 Authorization 헤더에 없습니다.', 'UNAUTHORIZED');
      },
      secretOrKey: process.env.JWT_SIGNUP_SECRET,
      ignoreExpiration: false,
      algorithms: ['HS256'],
    });
  }

  async validate(payload: SignupPayloadType) {
    try {
      const decryptOauthId = Number(this.authService.decrypt(payload.id));
      const oauth = await this.oauthService.findById(decryptOauthId);

      if (!oauth) {
        throw new UnauthorizedException('OAuth 정보가 유효하지 않습니다.', 'UNAUTHORIZED');
      }

      if (oauth.userId) {
        throw new ConflictException('이미 회원가입이 되어있는 계정입니다.');
      }

      return { oauthId: oauth.id, email: payload.email, image: payload.image };
    } catch {
      throw new UnauthorizedException('Unauthorized', 'UNAUTHORIZED');
    }
  }
}
