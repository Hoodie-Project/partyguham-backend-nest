import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';

import { AuthService } from '../auth.service';

@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy, 'refresh') {
  constructor(private authService: AuthService) {
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

  async validate(
    req: Request,
    payload: { id: string; iat: number; exp: number },
  ): Promise<{
    userId: number;
  }> {
    try {
      const refreshToken = req.cookies['refreshToken'] ?? req.headers['authorization']?.replace('Bearer ', '');

      if (!refreshToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const decryptUserId = Number(this.authService.decrypt(payload.id));

      const result = await this.authService.getRefreshToken(decryptUserId);
      console.log('Refresh token from redis:', result);

      if (result !== refreshToken) {
        throw new UnauthorizedException('Refresh token not found');
      }

      return { userId: decryptUserId };
    } catch (err) {
      throw new UnauthorizedException('Unauthorized', 'UNAUTHORIZED');
    }
  }
}
