import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';

import { PayloadType } from '../jwt.payload';
import { CommonUserService } from 'src/user/application/common.user.service';

@Injectable()
export class RecoverStrategy extends PassportStrategy(Strategy, 'recover') {
  constructor(private commonUserService: CommonUserService) {
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

  async validate(payload: PayloadType) {
    const userExternalId = payload.sub;

    const user = await this.commonUserService.findByExternalIdWithoutDeleted(userExternalId);

    if (!user) {
      throw new UnauthorizedException('Unauthorized', 'UNAUTHORIZED');
    }

    return { userId: user.id, userExternalId };
  }
}
