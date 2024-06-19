import { DataSource, Repository } from 'typeorm';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { StatusEnum } from 'src/common/entity/baseEntity';

import { PartyApplicationEntity } from '../entity/apply/party_application.entity';
import { IPartyApplicationRepository } from 'src/party/domain/party/repository/iPartyApplication.repository';

@Injectable()
export class PartyApplicationRepository implements IPartyApplicationRepository {
  constructor(
    readonly dataSource: DataSource,
    @InjectRepository(PartyApplicationEntity)
    private partyApplicationRepository: Repository<PartyApplicationEntity>,
  ) {}

  async create(userId: number, partyId: number, message: string) {
    const partyApplication = await this.partyApplicationRepository.save({ userId, partyId, message });

    return partyApplication;
  }

  async findAll(partyId: number) {
    const partyApplication = await this.partyApplicationRepository.find({
      where: { id: partyId },
    });

    if (!partyApplication) {
      throw new NotFoundException('파티 모집이 존재하지 않습니다');
    }

    return partyApplication;
  }

  async findOne(partyApplicationId: number) {
    const partyApplication = await this.partyApplicationRepository.findOne({
      where: { id: partyApplicationId },
    });

    if (!partyApplication) {
      throw new NotFoundException('파티 모집이 존재하지 않습니다');
    }

    return partyApplication;
  }

  async findOneWithRecruitment(partyApplicationId: number) {
    const partyApplication = await this.partyApplicationRepository.findOne({
      where: { id: partyApplicationId },
      relations: ['partyRecruitment'],
    });

    if (!partyApplication) {
      throw new NotFoundException('파티 모집이 존재하지 않습니다');
    }

    return partyApplication;
  }

  async findOneByUserIdAndPartyRecruitmentId(userId: number, partyRecruitmentId: number) {
    const partyApplication = await this.partyApplicationRepository.findOne({
      where: { userId, partyRecruitmentId },
    });

    return partyApplication;
  }

  async update(partyId: number, title: string, content: string) {
    const partyApplication = await this.findOne(partyId);

    await this.partyApplicationRepository.save({ ...partyApplication, title, content });
  }

  async delete(partyId: number) {
    const partyApplication = await this.findOne(partyId);
    const status = StatusEnum.DELETED;

    await this.partyApplicationRepository.save({ ...partyApplication, status });
  }
}
