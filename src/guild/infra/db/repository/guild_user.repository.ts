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

  async createUser(userId: number, guildId: number, positionId: number) {
    await this.guildUserRepository.save({ userId, guildId, positionId });
  }

  async createMaster(userId: number, guildId: number) {
    const authority = Authority.MASTER;

    await this.guildUserRepository.save({ userId, guildId, Authority });
  }

  async createEditor(userId: number, guildId: number, positionId: number) {
    const authority = Authority.EDITOR;

    await this.guildUserRepository.save({ userId, guildId, positionId, Authority });

    // return this.guildUserFactory
  }

  async findOne(userId: number, guildId: number) {
    return await this.guildUserRepository.findOne({ where: { userId, guildId } });
  }
}
