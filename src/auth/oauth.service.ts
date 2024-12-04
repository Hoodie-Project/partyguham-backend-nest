import { Injectable } from '@nestjs/common';

import { OauthRepository } from './repository/oauth.repository';
import { ProviderEnum } from './entity/oauth.entity';

@Injectable()
export class OauthService {
  constructor(private oauthRepository: OauthRepository) {}

  async findById(id: number) {
    return this.oauthRepository.findById(id);
  }

  async findBy(id: number) {
    return this.oauthRepository.findById(id);
  }

  async findByExternalId(externalId: string) {
    return this.oauthRepository.findByExternalId(externalId);
  }

  async findByUserId(userId: number) {
    return this.oauthRepository.findByUserId(userId);
  }

  async createWithoutUserId(externalId: string, provider: ProviderEnum, accessToken: string) {
    return this.oauthRepository.createWithoutUserId(externalId, provider, accessToken);
  }

  async updateUserIdById(id: number, userId: number) {
    return this.oauthRepository.updateUserIdById(id, userId);
  }
}
