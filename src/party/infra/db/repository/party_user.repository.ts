import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { PartyUserEntity, PartyAuthority } from '../entity/party/party_user.entity';
import { IPartyUserRepository } from 'src/party/domain/party/repository/iPartyUser.repository';

@Injectable()
export class PartyUserRepository implements IPartyUserRepository {
  constructor(
    readonly dataSource: DataSource,
    @InjectRepository(PartyUserEntity)
    private partyUserRepository: Repository<PartyUserEntity>,
  ) {}

  async createMember(userId: number, partyId: number, partyTypeId: number) {
    const partyAuthority = PartyAuthority.MEMBER;

    await this.partyUserRepository.save({ userId, partyId, partyTypeId, partyAuthority });
  }

  async createMaster(userId: number, partyId: number, partyTypeId: number) {
    const partyAuthority = PartyAuthority.MASTER;

    await this.partyUserRepository.save({ userId, partyId, partyTypeId, partyAuthority });
  }

  async createEditor(userId: number, partyId: number, partyTypeId: number) {
    const partyAuthority = PartyAuthority.EDITOR;

    await this.partyUserRepository.save({ userId, partyId, partyTypeId, partyAuthority });

    // return this.partyUserFactory
  }

  async findOne(userId: number, partyId: number) {
    return await this.partyUserRepository.findOne({ where: { userId, partyId } });
  }
}
