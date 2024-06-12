import { DataSource, Repository } from 'typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { IPartyRepository } from 'src/party/domain/party/repository/iParty.repository';
import { PartyEntity } from '../entity/party/party.entity';
import { PartyFactory } from 'src/party/domain/party/party.factory';
import { Party } from 'src/party/domain/party/party';
import { StatusEnum } from 'src/common/entity/baseEntity';

@Injectable()
export class PartyRepository implements IPartyRepository {
  constructor(
    readonly dataSource: DataSource,
    @InjectRepository(PartyEntity)
    private partyRepository: Repository<PartyEntity>,
    private partyFactory: PartyFactory,
  ) {}

  async create(partyTypeId: number, title: string, content: string, image: string): Promise<Party> {
    const party = await this.partyRepository.save({ partyTypeId, title, content, image });

    return this.partyFactory.reconstitute(party.id, title, content, party.image);
  }

  async findOne(partyId: number) {
    const party = await this.partyRepository.findOne({
      where: { id: partyId },
    });

    if (!party) {
      throw new NotFoundException('파티가 존재하지 않습니다');
    }

    return this.partyFactory.reconstitute(party.id, party.title, party.content, party.image);
  }

  async update(partyId: number, title: string, content: string, image: string) {
    const party = await this.findOne(partyId);

    await this.partyRepository.save({ ...party, title, content, image });
  }

  async delete(partyId: number) {
    const party = await this.findOne(partyId);
    const status = StatusEnum.DELETED;

    await this.partyRepository.save({ ...party, status });
  }
}
