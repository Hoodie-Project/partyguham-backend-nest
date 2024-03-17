import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';

import { AuthService } from './auth.service';
import { DecodedPayload } from './jwt.payload';

@Injectable()
export class AccessStrategy extends PassportStrategy(Strategy, 'access') {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_ACCESS_SECRET,
      ignoreExpiration: false,
    });
  }

  async validate(payload: { id: string; iat: number; exp: number }): Promise<DecodedPayload> {
    if (payload) {
      const id: number = Number(this.authService.decrypt(payload.id));
      return { id }; // request.user
    } else {
      throw new UnauthorizedException('Unauthorized');
    }
  }
}
