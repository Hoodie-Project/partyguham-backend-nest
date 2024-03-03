import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { UserFactory } from 'src/user/domain/user/user.factory';
import { User } from 'src/user/domain/user/user';
import { IOauthRepository } from 'src/user/domain/user/repository/ioauth.repository';
import { OauthEntity, PlatformEnum } from '../entity/oauth.entity';

@Injectable()
export class OauthRepository implements IOauthRepository {
  constructor(
    readonly dataSource: DataSource,
    @InjectRepository(OauthEntity)
    private oauthRepository: Repository<OauthEntity>,
    private userFactory: UserFactory,
  ) {}

  async findByExternalId(externalId: string) {
    const oauthEntity = await this.oauthRepository.findOne({
      where: { externalId },
    });

    if (!oauthEntity) {
      return null;
    }

    const { uuid, userId, platform, accessToken } = oauthEntity;

    return oauthEntity;
  }

  async create(userId: number, externalId: string, platform: PlatformEnum, accessToken: string) {
    const oauthEntity = await this.oauthRepository.save({ userId, externalId, platform, accessToken });
    const {
      userId: createAccount,
      externalId: createNickname,
      platform: createEmail,
      accessToken: createGender,
    } = oauthEntity;

    return oauthEntity;
    // return this.userFactory.create(id, createAccount, createNickname, createEmail, createGender, createBirth);
  }

  async update(): Promise<void> {
    await this.dataSource.transaction(async (manager) => {
      const user = await this.oauthRepository.save({});

      await manager.save(user);
    });
  }
}
