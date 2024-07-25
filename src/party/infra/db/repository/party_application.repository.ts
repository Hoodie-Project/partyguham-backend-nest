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

  async create(userId: number, partyRecruitmentId: number, message: string) {
    const partyApplication = await this.partyApplicationRepository.save({ userId, partyRecruitmentId, message });

    return partyApplication;
  }

  async findAll(partyRecruitmentId: number) {
    const partyApplication = await this.partyApplicationRepository.find({
      where: { id: partyRecruitmentId },
    });

    return partyApplication;
  }

  async findOne(partyApplicationId: number) {
    const partyApplication = await this.partyApplicationRepository.findOne({
      where: { id: partyApplicationId },
    });

    return partyApplication;
  }

  async findOneWithRecruitment(partyApplicationId: number) {
    const partyApplication = await this.partyApplicationRepository.findOne({
      where: { id: partyApplicationId },
      relations: ['partyRecruitment'],
    });

    return partyApplication;
  }

  async findOneByUserIdAndPartyRecruitmentId(userId: number, partyRecruitmentId: number) {
    const partyApplication = await this.partyApplicationRepository.findOne({
      where: { userId, partyRecruitmentId },
    });

    return partyApplication;
  }

  async update(partyRecruitmentId: number, title: string, content: string) {
    const partyApplication = await this.findOne(partyRecruitmentId);

    await this.partyApplicationRepository.save({ ...partyApplication, title, content });
  }

  async delete(partyRecruitmentId: number) {
    const partyApplication = await this.findOne(partyRecruitmentId);
    const status = StatusEnum.DELETED;

    await this.partyApplicationRepository.save({ ...partyApplication, status });
  }
}
