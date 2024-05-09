import { DataSource, Repository } from 'typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { GuildEntity } from '../entity/guild/guild.entity';

import { StatusEnum } from 'src/common/entity/baseEntity';
import { IGuildRepository } from 'src/guild/domain/guild/repository/iGuild.repository';
import { GuildFactory } from 'src/guild/domain/guild/guild.factory';
import { Guild } from 'src/guild/domain/guild/guild';

@Injectable()
export class GuildRepository implements IGuildRepository {
  constructor(
    readonly dataSource: DataSource,
    @InjectRepository(GuildEntity)
    private guildRepository: Repository<GuildEntity>,
    private guildFactory: GuildFactory,
  ) {}

  async create(title: string, content: string): Promise<Guild> {
    const party = await this.guildRepository.save({ title, content });

    return this.guildFactory.reconstitute(party.id, title, content);
  }

  async findOne(partyId: number) {
    const party = await this.guildRepository.findOne({
      where: { id: partyId },
    });

    if (!party) {
      throw new NotFoundException('파티가 존재하지 않습니다');
    }

    return this.guildFactory.reconstitute(party.id, party.title, party.content);
  }

  async update(partyId: number, title: string, content: string) {
    const party = await this.findOne(partyId);

    await this.guildRepository.save({ ...party, title, content });
  }

  async delete(partyId: number) {
    const party = await this.findOne(partyId);
    const status = StatusEnum.DELETED;

    await this.guildRepository.save({ ...party, status });
  }
}
