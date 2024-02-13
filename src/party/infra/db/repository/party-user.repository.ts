import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { PartyUserEntity, Permission } from '../entity/party/party-user.entity';
import { IPartyUserRepository } from 'src/party/domain/party/repository/iPartyUser.repository';

@Injectable()
export class PartyUserRepository implements IPartyUserRepository {
  constructor(
    readonly dataSource: DataSource,
    @InjectRepository(PartyUserEntity)
    private partyUserRepository: Repository<PartyUserEntity>,
  ) {}

  async createUser(userId: number, partyId: number, positionId: number) {
    await this.partyUserRepository.save({ userId, partyId, positionId });
  }

  async createMaster(userId: number, partyId: number, positionId: number) {
    const permission = Permission.MASTER;

    await this.partyUserRepository.save({ userId, partyId, positionId, permission });
  }

  async createEditor(userId: number, partyId: number, positionId: number) {
    const permission = Permission.EDITOR;

    await this.partyUserRepository.save({ userId, partyId, positionId, permission });

    // return this.partyUserFactory
  }

  async findOne(userId: number, partyId: number) {
    return await this.partyUserRepository.findOne({ where: { userId, partyId } });
  }
}
