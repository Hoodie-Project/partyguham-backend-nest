import { DataSource, Repository } from 'typeorm';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { StatusEnum } from 'src/common/entity/baseEntity';

import { PartyApplicationEntity } from '../../entity/apply/party_application.entity';
import { IPartyApplicationRepository } from 'src/party/domain/party/repository/iPartyApplication.repository';

@Injectable()
export class PartyApplicationRepository implements IPartyApplicationRepository {
  constructor(
    readonly dataSource: DataSource,
    @InjectRepository(PartyApplicationEntity)
    private partyApplicationRepository: Repository<PartyApplicationEntity>,
  ) {}

  async createStatusPending(userId: number, partyRecruitmentId: number, message: string) {
    const partyApplication = await this.partyApplicationRepository.save({
      userId,
      partyRecruitmentId,
      message,
      status: StatusEnum.PENDING,
    });

    return partyApplication;
  }

  async findAll(id: number) {
    const partyApplication = await this.partyApplicationRepository.find({
      where: { id },
    });

    return partyApplication;
  }

  async findAllByPartyRecruitmentId(partyRecruitmentId: number) {
    const partyApplication = await this.partyApplicationRepository.find({
      where: { partyRecruitmentId },
    });

    return partyApplication;
  }

  async findOne(id: number) {
    const partyApplication = await this.partyApplicationRepository.findOne({
      where: { id },
    });

    return partyApplication;
  }

  async findOneByIdWithUserData(id: number) {
    return this.partyApplicationRepository.findOne({
      relations: ['user'],
      where: { id },
    });
  }

  async findOneWithRecruitment(id: number) {
    const partyApplication = await this.partyApplicationRepository.findOne({
      where: { id },
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

  async updateStatusProcessing(id: number) {
    const partyApplication = await this.findOne(id);

    await this.partyApplicationRepository.save({ ...partyApplication, status: StatusEnum.PROCESSING });
  }

  async updateStatusApproved(id: number) {
    const partyApplication = await this.findOne(id);

    await this.partyApplicationRepository.save({ ...partyApplication, status: StatusEnum.APPROVED });
  }

  async updateStatusRejected(id: number) {
    const partyApplication = await this.findOne(id);

    await this.partyApplicationRepository.save({ ...partyApplication, status: StatusEnum.REJECTED });
  }

  async softDeleteById(id: number) {
    const partyApplication = await this.findOne(id);
    const status = StatusEnum.DELETED;

    await this.partyApplicationRepository.save({ ...partyApplication, status });
  }

  async deleteById(id: number) {
    await this.partyApplicationRepository.delete({ id });
  }

  async deleteByUserId(userId: number) {
    await this.partyApplicationRepository.delete({ userId });
  }
}
