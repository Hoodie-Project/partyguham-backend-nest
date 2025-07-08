import { NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { PartyEntity } from 'src/party/infra/db/entity/party/party.entity';

import { Repository } from 'typeorm';
import { GetPartyQuery } from './get-party.query';
import { StatusEnum } from 'src/common/entity/baseEntity';

@QueryHandler(GetPartyQuery)
export class GetPartyHandler implements IQueryHandler<GetPartyQuery> {
  constructor(@InjectRepository(PartyEntity) private partyRepository: Repository<PartyEntity>) {}

  async execute(query: GetPartyQuery) {
    const { partyId } = query;

    const partyQuery = this.partyRepository
      .createQueryBuilder('party')
      .leftJoinAndSelect('party.partyType', 'partyType')
      .select(['party', 'partyType'])
      .where('party.id = :id', { id: partyId })
      .andWhere('party.status != :deleted', { deleted: StatusEnum.DELETED });

    const party = await partyQuery.getOne();

    if (!party) {
      throw new NotFoundException('파티를 찾을 수 없습니다.', 'PARTY_NOT_EXIST');
    }

    return party;
  }
}
