import { DataSource, Repository } from 'typeorm';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { StatusEnum } from 'src/common/entity/baseEntity';
import { IPartyRecruitmentRepository } from 'src/party/domain/party/repository/iPartyRecruitment.repository';
import { PartyRecruitmentEntity } from '../entity/apply/party_recruitment.entity';
import { RecruitmentDto } from 'src/party/interface/dto/recruitmentDto';

@Injectable()
export class PartyRecruitmentRepository implements IPartyRecruitmentRepository {
  constructor(
    readonly dataSource: DataSource,
    @InjectRepository(PartyRecruitmentEntity)
    private partyRecruitmentRepository: Repository<PartyRecruitmentEntity>,
  ) {}

  async create(partyId: number, positionId: number, capacity: number) {
    const partyRecruitment = await this.partyRecruitmentRepository.save({ partyId, positionId, capacity });

    return partyRecruitment;
  }

  async bulkInsert(partyId: number, recruitment: RecruitmentDto[]) {
    const partyRecruitments = recruitment.map((value) => ({
      partyId,
      ...value,
    }));

    try {
      const result = await this.partyRecruitmentRepository.save(partyRecruitments);
      return result;
    } catch (error) {
      if (error.driverError.code === '23505') throw new BadRequestException('중복으로 포지션을 넣을 수 없습니다.');
    }
  }

  async findAll(partyId: number) {
    const partyRecruitment = await this.partyRecruitmentRepository.find({
      where: { id: partyId },
    });

    if (!partyRecruitment) {
      throw new NotFoundException('파티 모집이 존재하지 않습니다');
    }

    return partyRecruitment;
  }

  async findOne(partyId: number) {
    const partyRecruitment = await this.partyRecruitmentRepository.findOne({
      where: { id: partyId },
    });

    if (!partyRecruitment) {
      throw new NotFoundException('파티 모집이 존재하지 않습니다');
    }

    return partyRecruitment;
  }

  async update(partyId: number, title: string, content: string) {
    const partyRecruitment = await this.findOne(partyId);

    await this.partyRecruitmentRepository.save({ ...partyRecruitment, title, content });
  }

  async delete(partyId: number) {
    const partyRecruitment = await this.findOne(partyId);
    const status = StatusEnum.DELETED;

    await this.partyRecruitmentRepository.save({ ...partyRecruitment, status });
  }
}
