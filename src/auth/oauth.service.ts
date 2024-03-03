import { Injectable } from '@nestjs/common';

import { OauthRepository } from './repository/oauth.repository';
import { PlatformEnum } from './entity/oauth.entity';

@Injectable()
export class OauthService {
  constructor(private oauthRepository: OauthRepository) {}

  async findByExternalId(externalId: string) {
    return this.oauthRepository.findByExternalId(externalId);
  }

  async create(userId: number, externalId: string, platform: PlatformEnum, accessToken: string) {
    return this.oauthRepository.create(userId, externalId, platform, accessToken);
  }
}
