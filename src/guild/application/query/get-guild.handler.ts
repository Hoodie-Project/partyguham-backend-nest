import { NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { GetGuildQuery } from './get-guild.query';
import { GuildEntity } from 'src/guild/infra/db/entity/guild/guild.entity';

@QueryHandler(GetGuildQuery)
export class GetGuildHandler implements IQueryHandler<GetGuildQuery> {
  constructor(@InjectRepository(GuildEntity) private guildRepository: Repository<GuildEntity>) {}

  async execute(query: GetGuildQuery) {
    const { guildId } = query;

    const result = await this.guildRepository.findOne({
      where: { id: guildId },
    });
    if (!result) {
      throw new NotFoundException('길드가 존재하지 않습니다');
    }

    return result;
  }
}
