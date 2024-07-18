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

  async createMember(userId: number, partyId: number, positionId: number) {
    const authority = PartyAuthority.MEMBER;

    await this.partyUserRepository.save({ userId, partyId, positionId, authority });
  }

  async createMaster(userId: number, partyId: number, positionId: number) {
    const authority = PartyAuthority.MASTER;

    await this.partyUserRepository.save({ userId, partyId, positionId, authority });
  }

  async createDeputy(userId: number, partyId: number, positionId: number) {
    const authority = PartyAuthority.DEPUTY;

    await this.partyUserRepository.save({ userId, partyId, positionId, authority });
  }

  async updateByPositionId(id: number, positionId: number) {
    return await this.partyUserRepository.save({ id, positionId });
  }

  async findOneById(id: number) {
    return await this.partyUserRepository.findOne({ where: { id } });
  }

  async findOne(userId: number, partyId: number) {
    return await this.partyUserRepository.findOne({ where: { userId, partyId } });
  }

  async deleteById(id: number) {
    await this.partyUserRepository.delete({ id });
  }
}
