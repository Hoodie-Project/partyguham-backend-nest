import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { IPartyRepository } from 'src/party/domain/party/repository/iParty.repository';
import { PartyEntity } from '../entity/party/party.entity';

import { Party } from 'src/party/domain/party/party';
import { StatusEnum } from 'src/common/entity/baseEntity';

@Injectable()
export class PartyRepository implements IPartyRepository {
  constructor(
    readonly dataSource: DataSource,
    @InjectRepository(PartyEntity)
    private partyRepository: Repository<PartyEntity>,
  ) {}

  async create(partyTypeId: number, title: string, content: string, image: string) {
    return await this.partyRepository.save({ partyTypeId, title, content, image });
  }

  async findOne(partyId: number) {
    return await this.partyRepository.findOne({
      where: { id: partyId },
    });
  }

  async update(party: Party) {
    return await this.partyRepository.save({ ...party });
  }

  async delete(partyId: number) {
    const status = StatusEnum.DELETED;
    await this.partyRepository.save({ partyId, status });
  }
}
