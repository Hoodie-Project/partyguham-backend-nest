import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { GetPartyTypesQuery } from './get-partyTypes.query';
import { PartyTypeEntity } from 'src/party/infra/db/entity/party/party_type.entity';

@QueryHandler(GetPartyTypesQuery)
export class GetPartyTypesHandler implements IQueryHandler<GetPartyTypesQuery> {
  constructor(@InjectRepository(PartyTypeEntity) private partyTypeRepository: Repository<PartyTypeEntity>) {}

  async execute(query: GetPartyTypesQuery) {
    const partyTypes = await this.partyTypeRepository.find();

    return partyTypes;
  }
}
