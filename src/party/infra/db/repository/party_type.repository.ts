import { DataSource, Repository } from 'typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { PartyFactory } from 'src/party/domain/party/party.factory';
import { IPartyTypeRepository } from 'src/party/domain/party/repository/iPartyType.repository';
import { PartyTypeEntity } from '../entity/party/party_type.entity';

@Injectable()
export class PartyTypeRepository implements IPartyTypeRepository {
  constructor(
    readonly dataSource: DataSource,
    @InjectRepository(PartyTypeEntity)
    private partyRepository: Repository<PartyTypeEntity>,
    private partyFactory: PartyFactory,
  ) {}

  async findOne(partyTypeId: number) {
    const party = await this.partyRepository.findOne({
      where: { id: partyTypeId },
    });

    return party;
  }

  async findAll() {
    const party = await this.partyRepository.find({});

    return party;
  }
}
