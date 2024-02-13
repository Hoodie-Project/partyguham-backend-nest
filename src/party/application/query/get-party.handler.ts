import { NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { PartyEntity } from 'src/party/infra/db/entity/party/party.entity';

import { Repository } from 'typeorm';
import { GetPartyQuery } from './get-party.query';

@QueryHandler(GetPartyQuery)
export class GetUserHandler implements IQueryHandler<GetPartyQuery> {
  constructor(@InjectRepository(PartyEntity) private partyRepository: Repository<PartyEntity>) {}

  async execute(query: GetPartyQuery) {
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
