import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { GetGuildsQuery } from './get-guilds.query';
import { GuildEntity } from 'src/guild/infra/db/entity/guild/guild.entity';

@QueryHandler(GetGuildsQuery)
export class GetGuildsHandler implements IQueryHandler<GetGuildsQuery> {
  constructor(@InjectRepository(GuildEntity) private partyRepository: Repository<GuildEntity>) {}

  async execute(query: GetGuildsQuery) {
    const { page, limit, sort, order } = query;

    const offset = (page - 1) * limit || 0;
    const parties = await this.partyRepository
      .createQueryBuilder('party')
      .limit(limit)
      .offset(offset)
      .orderBy(`party.${sort}`, order)
      .getManyAndCount();

    return parties;
  }
}
