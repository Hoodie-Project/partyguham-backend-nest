import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { GetPartiesQuery } from './get-parties.query';
import { PartyEntity } from 'src/party/infra/db/entity/party/party.entity';

@QueryHandler(GetPartiesQuery)
export class GetPartiesHandler implements IQueryHandler<GetPartiesQuery> {
  constructor(@InjectRepository(PartyEntity) private partyRepository: Repository<PartyEntity>) {}

  async execute(query: GetPartiesQuery) {
    const { page, limit, sort, order } = query;

    const offset = (page - 1) * limit || 0;
    const [parties, total] = await this.partyRepository
      .createQueryBuilder('party')
      .leftJoinAndSelect('party.partyType', 'partyType')
      .leftJoinAndSelect('party.partyRecruitments', 'partyRecruitments')
      .limit(limit)
      .offset(offset)
      .orderBy(`party.${sort}`, order)
      .getManyAndCount();

    parties.forEach((party) => {
      if (party.status === 'deleted') {
        party['tag'] = '파티 종료';
      } else if (party.partyRecruitments.length === 0) {
        party['tag'] = '진행중';
      } else {
        party['tag'] = '모집중';
      }
    });

    return { parties, total };
  }
}
