import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { GuildUserEntity, Authority } from '../entity/guild/guild_user.entity';
import { IGuildUserRepository } from 'src/guild/domain/guild/repository/iGuildUser.repository';

@Injectable()
export class GuildUserRepository implements IGuildUserRepository {
  constructor(
    readonly dataSource: DataSource,
    @InjectRepository(GuildUserEntity)
    private guildUserRepository: Repository<GuildUserEntity>,
  ) {}

  async createUser(userId: number, positionId: number) {
    await this.guildUserRepository.save({ userId, positionId });
  }

  async createMaster(userId: number) {
    const authority = Authority.MASTER;

    await this.guildUserRepository.save({ userId, authority });
  }

  async createEditor(userId: number, positionId: number) {
    const authority = Authority.EDITOR;

    await this.guildUserRepository.save({ userId, positionId, authority });

    // return this.guildUserFactory
  }

  async findOne(userId: number) {
    return await this.guildUserRepository.findOne({ where: { userId } });
  }
}
