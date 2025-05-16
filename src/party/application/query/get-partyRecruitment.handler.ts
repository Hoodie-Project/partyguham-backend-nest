import { NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { GetPartyRecruitmentQuery } from './get-partyRecruitment.query';
import { PartyRecruitmentEntity } from 'src/party/infra/db/entity/apply/party_recruitment.entity';
import { PartyUserEntity } from 'src/party/infra/db/entity/party/party_user.entity';
import { StatusEnum } from 'src/common/entity/baseEntity';

@QueryHandler(GetPartyRecruitmentQuery)
export class GetPartyRecruitmentHandler implements IQueryHandler<GetPartyRecruitmentQuery> {
  constructor(
    @InjectRepository(PartyRecruitmentEntity) private partyRecruitmentRepository: Repository<PartyRecruitmentEntity>,
    @InjectRepository(PartyUserEntity) private partyUser: Repository<PartyUserEntity>,
  ) {}

  async execute(query: GetPartyRecruitmentQuery) {
    const { partyRecruitmentId } = query;

    const partyQuery = this.partyRecruitmentRepository
      .createQueryBuilder('partyRecruitments')
      .leftJoin('partyRecruitments.party', 'party')
      .leftJoin('partyRecruitments.position', 'position')
      .leftJoin('partyRecruitments.partyApplications', 'partyApplications')
      .leftJoin('party.partyType', 'partyType')
      .loadRelationCountAndMap('partyRecruitments.applicationCount', 'partyRecruitments.partyApplications')
      .select([
        'party.id',
        'party.title',
        'party.image',
        'party.status',
        'partyType.type',
        'position.id',
        'position.main',
        'position.sub',
        'partyRecruitments.content',
        'partyRecruitments.recruitingCount',
        'partyRecruitments.recruitedCount',
        'partyRecruitments.status',
        'partyRecruitments.createdAt',
      ])
      .where('partyRecruitments.id = :id', { id: partyRecruitmentId })
      .andWhere('partyRecruitments.status != :status', { status: StatusEnum.DELETED })
      .andWhere('party.status != :party', { party: StatusEnum.DELETED });

    const partyRecruitment = await partyQuery.getOne();

    if (!partyRecruitment) {
      throw new NotFoundException('파티 모집이 존재하지 않습니다', 'PARTY_RECRUITMENT_NOT_EXIST');
    }

    return partyRecruitment;
  }
}
