import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { OauthEntity, PlatformEnum } from '../entity/oauth.entity';

@Injectable()
export class OauthRepository {
  constructor(
    readonly dataSource: DataSource,
    @InjectRepository(OauthEntity)
    private oauthRepository: Repository<OauthEntity>,
  ) {}

  async findByExternalId(externalId: string) {
    const oauthEntity = await this.oauthRepository.findOne({
      where: { externalId },
    });

    if (!oauthEntity) {
      return null;
    }

    return oauthEntity;
  }

  async create(userId: number, externalId: string, platform: PlatformEnum, accessToken: string) {
    const oauthEntity = await this.oauthRepository.save({ userId, externalId, platform, accessToken });

    return oauthEntity;
  }

  async update(): Promise<void> {
    await this.dataSource.transaction(async (manager) => {
      const user = await this.oauthRepository.save({});

      await manager.save(user);
    });
  }
}
