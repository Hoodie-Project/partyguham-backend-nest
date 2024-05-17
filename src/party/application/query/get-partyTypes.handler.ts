import { NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { PartyEntity } from 'src/party/infra/db/entity/party/party.entity';

import { Repository } from 'typeorm';
import { GetPartyTypesQuery } from './get-partyTypes.query';

@QueryHandler(GetPartyTypesQuery)
export class GetPartyTypesHandler implements IQueryHandler<GetPartyTypesQuery> {
  constructor(@InjectRepository(PartyEntity) private partyRepository: Repository<PartyEntity>) {}

  async execute(query: GetPartyTypesQuery) {
    const result = await this.partyRepository.find({});
    if (!result) {
      throw new NotFoundException('파티 타입 데이터가 존재하지 않습니다');
    }

    return result;
  }
}
