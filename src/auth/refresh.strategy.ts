import { Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';

import { AuthService } from './auth.service';

@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy, 'refresh') {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: (request: Request) => {
        if (request && request.cookies) {
          const refreshToken = request.cookies['refreshToken'];
          if (!refreshToken) throw new UnauthorizedException('refreshToken이 cookies에 없습니다.');
          return refreshToken;
        }
      },
      secretOrKey: process.env.JWT_REFRESH_SECRET,
      ignoreExpiration: false,
    });
  }

  async validate(payload: { id: string; iat: number; exp: number }): Promise<{
    id: number;
  }> {
    if (payload.id) {
      const decryptUserId = Number(this.authService.decrypt(payload.id));

      return { id: decryptUserId };
    } else {
      throw new UnauthorizedException('Unauthorized');
    }
  }
}
