import { NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { GetGuildQuery } from './get-guild.query';
import { GuildEntity } from 'src/guild/infra/db/entity/guild/guild.entity';

@QueryHandler(GetGuildQuery)
export class GetGuildHandler implements IQueryHandler<GetGuildQuery> {
  constructor(@InjectRepository(GuildEntity) private partyRepository: Repository<GuildEntity>) {}

  async execute(query: GetGuildQuery) {
    const { partyId } = query;

    const result = await this.partyRepository.findOne({
      where: { id: partyId },
    });
    if (!result) {
      throw new NotFoundException('파티가 존재하지 않습니다');
    }

    return result;
  }
}
