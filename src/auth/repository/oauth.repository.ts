import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { OauthEntity, ProviderEnum } from '../entity/oauth.entity';

@Injectable()
export class OauthRepository {
  constructor(
    readonly dataSource: DataSource,
    @InjectRepository(OauthEntity)
    private oauthRepository: Repository<OauthEntity>,
  ) {}

  async findById(id: number) {
    const oauthEntity = await this.oauthRepository.findOne({
      where: { id },
    });

    if (!oauthEntity) {
      return null;
    }

    return oauthEntity;
  }

  async findOneByUserId(userId: number) {
    const oauthEntity = await this.oauthRepository.findOne({
      where: { userId },
    });

    if (!oauthEntity) {
      return null;
    }

    return oauthEntity;
  }

  async findByUserId(userId: number) {
    const oauthEntity = await this.oauthRepository.find({
      where: { userId },
    });

    return oauthEntity;
  }

  async findByExternalId(externalId: string) {
    const oauthEntity = await this.oauthRepository.findOne({
      where: { externalId },
    });

    if (!oauthEntity) {
      return null;
    }

    return oauthEntity;
  }

  async createWithoutUserId(externalId: string, provider: ProviderEnum, accessToken: string) {
    const oauthEntity = await this.oauthRepository.save({ externalId, provider, accessToken });

    return oauthEntity;
  }

  async updateUserIdById(id: number, userId: number) {
    const user = await this.oauthRepository.update(id, { userId });

    return user;
  }
}
