import { DataSource, In, Not, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { PartyUserEntity, PartyAuthority } from '../../entity/party/party_user.entity';
import { IPartyUserRepository } from 'src/party/domain/party/repository/iPartyUser.repository';
import { StatusEnum } from 'src/common/entity/baseEntity';

@Injectable()
export class PartyUserRepository implements IPartyUserRepository {
  constructor(
    readonly dataSource: DataSource,
    @InjectRepository(PartyUserEntity)
    private partyUserRepository: Repository<PartyUserEntity>,
  ) {}

  async count(partyId: number) {
    return await this.partyUserRepository.count({ where: { partyId } });
  }

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

  async updateMember(id: number) {
    const authority = PartyAuthority.MEMBER;

    await this.partyUserRepository.update({ id }, { authority });
  }

  async updateMaster(id: number) {
    const authority = PartyAuthority.MASTER;

    await this.partyUserRepository.update({ id }, { authority });
  }

  async updateDeputy(id: number) {
    const authority = PartyAuthority.DEPUTY;

    await this.partyUserRepository.update({ id }, { authority });
  }

  async updatePositionById(id: number, positionId: number) {
    return await this.partyUserRepository.update({ id }, { positionId });
  }

  async findOneById(id: number) {
    return await this.partyUserRepository.findOne({ where: { id, status: Not(StatusEnum.DELETED) } });
  }

  async findAllbByPartyId(partyId: number) {
    return await this.partyUserRepository.find({ where: { partyId, status: Not(StatusEnum.DELETED) } });
  }

  async findOneMasterByPartyId(partyId: number) {
    return await this.partyUserRepository
      .createQueryBuilder('partyUser')
      .where('partyUser.partyId = :partyId', { partyId })
      .andWhere('partyUser.authority = :authority', { authority: PartyAuthority.MASTER })
      .andWhere('partyUser.status != :deleted', { deleted: StatusEnum.DELETED })
      .getOne();
  }

  async findMasterByUserId(userId: number) {
    return await this.partyUserRepository
      .createQueryBuilder('partyUser')
      .leftJoinAndSelect('partyUser.party', 'party')
      .where('partyUser.userId = :userId', { userId })
      .andWhere('partyUser.authority = :authority', { authority: PartyAuthority.MASTER })
      .andWhere('party.status = :status', { status: StatusEnum.ACTIVE })
      .getMany();
  }

  async findByIds(ids: number[]) {
    return await this.partyUserRepository.find({
      where: { id: In(ids) },
    });
  }

  async findByIdsWithUserData(ids: number[]) {
    return this.partyUserRepository.find({
      relations: ['user'],
      where: { id: In(ids) },
    });
  }

  async findOne(userId: number, partyId: number) {
    return await this.partyUserRepository.findOne({ where: { userId, partyId } });
  }

  async findOneWithUserData(userId: number, partyId: number) {
    return await this.partyUserRepository
      .createQueryBuilder('partyUser')
      .leftJoinAndSelect('partyUser.user', 'user')
      .where('partyUser.userId = :userId', { userId })
      .andWhere('partyUser.partyId = :partyId', { partyId })
      .getOne();
  }

  async deleteById(id: number) {
    await this.partyUserRepository.delete({ id });
  }

  async softDeleteById(id: number) {
    const partyUser = await this.findOneById(id);
    const status = StatusEnum.DELETED;

    await this.partyUserRepository.save({ ...partyUser, status });
  }

  async batchDelete(ids: number[]) {
    await this.partyUserRepository.delete(ids);
  }
}
