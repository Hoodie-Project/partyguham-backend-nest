import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { GetPartiesQuery } from './get-parties.query';
import { PartyEntity } from 'src/party/infra/db/entity/party/party.entity';

@QueryHandler(GetPartiesQuery)
export class GetPartiessHandler implements IQueryHandler<GetPartiesQuery> {
  constructor(@InjectRepository(PartyEntity) private partyRepository: Repository<PartyEntity>) {}

  async execute(query: GetPartiesQuery) {
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
