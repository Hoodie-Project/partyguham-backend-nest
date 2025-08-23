import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';

import { PayloadType } from '../jwt.payload';
import { CommonUserService } from 'src/user/application/common.user.service';

@Injectable()
export class AccessStrategy extends PassportStrategy(Strategy, 'access') {
  constructor(private commonUserService: CommonUserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_ACCESS_SECRET,
      ignoreExpiration: false,
    });
  }

  async validate(payload: PayloadType) {
    const userExternalId = payload.sub;

    const user = await this.commonUserService.findByExternalIdWithoutDeleted(userExternalId);

    return { userId: user.id, userExternalId };
  }
}
