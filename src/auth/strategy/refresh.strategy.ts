import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';

import { AuthService } from '../auth.service';
import { OauthService } from '../oauth.service';
import { CommonUserService } from 'src/user/application/common.user.service';

@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy, 'refresh') {
  constructor(
    private oauthService: OauthService,
    private authService: AuthService,
    private commonUserService: CommonUserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(), // header bearer 확인
        (req: Request) => {
          return req.cookies['refreshToken'] || null; // 쿠키 확인
        },
      ]),
      secretOrKey: process.env.JWT_REFRESH_SECRET,
      ignoreExpiration: false,
      passReqToCallback: true, // req를 콜백으로 전달
    });
  }

  async validate(req: Request, payload: { sub: string; iat: number; exp: number }) {
    try {
      //web
      const webRefreshToken = req.cookies['refreshToken'] ?? null;

      //mobile
      const mobileRefreshToken = req.headers['authorization']?.replace('Bearer ', '') ?? null;

      if (webRefreshToken && mobileRefreshToken) {
        throw new BadRequestException('Bad Request', 'BAD_REQUEST');
      }

      const refreshToken = webRefreshToken || mobileRefreshToken;
      const userExternalId = payload.sub;

      // web
      if (webRefreshToken) {
        const result = await this.authService.validateRefreshToken(userExternalId, 'web', refreshToken);
        if (!result) {
          throw new UnauthorizedException('Unauthorized', 'UNAUTHORIZED');
        }
      }

      // mobile
      if (mobileRefreshToken) {
        const result = await this.authService.validateRefreshToken(userExternalId, 'app', refreshToken);
        if (!result) {
          throw new UnauthorizedException('Unauthorized', 'UNAUTHORIZED');
        }
      }

      return { userExternalId };
    } catch (err) {
      throw new UnauthorizedException('Unauthorized', 'UNAUTHORIZED');
    }
  }
}
