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

    if (!party) {
      throw new NotFoundException('파티가 존재하지 않습니다');
    }

    return party;
  }

  async findAll() {
    const party = await this.partyRepository.find({});

    if (!party) {
      throw new NotFoundException('파티가 존재하지 않습니다');
    }

    return party;
  }
}
