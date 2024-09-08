import { NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { PartyEntity } from 'src/party/infra/db/entity/party/party.entity';

import { Repository } from 'typeorm';
import { GetPartyRecruitmentQuery } from './get-partyRecruitment.query';

@QueryHandler(GetPartyRecruitmentQuery)
export class GetPartyRecruitmentHandler implements IQueryHandler<GetPartyRecruitmentQuery> {
  constructor(@InjectRepository(PartyEntity) private partyRepository: Repository<PartyEntity>) {}

  async execute(query: GetPartyRecruitmentQuery) {
    const { partyId, sort, order, main } = query;

    const partyQuery = await this.partyRepository
      .createQueryBuilder('party')
      .leftJoinAndSelect('party.partyRecruitments', 'partyRecruitments')
      .leftJoinAndSelect('partyRecruitments.position', 'position')
      .leftJoinAndSelect('partyRecruitments.partyApplications', 'partyApplications')
      .where('party.id = :id', { id: partyId })
      .addOrderBy(`partyUser.${sort}`, order);

    if (main !== undefined && main !== null) {
      partyQuery.andWhere('position.main = :main', { main });
    }

    const party = await partyQuery.getOne();

    if (!party) {
      throw new NotFoundException('파티가 존재하지 않습니다', 'PARTY_NOT_EXIST');
    }

    return party.partyRecruitments;
  }
}
