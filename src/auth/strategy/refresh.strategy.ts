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
    });
  }

  async validate(payload: { id: string; iat: number; exp: number }): Promise<{
    oauthId: number;
  }> {
    try {
      const decryptUserId = Number(this.authService.decrypt(payload.id));

      return { oauthId: decryptUserId };
    } catch {
      throw new UnauthorizedException('Unauthorized', 'UNAUTHORIZED');
    }
  }
}
