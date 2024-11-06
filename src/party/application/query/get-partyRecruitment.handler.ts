import { NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { GetPartyRecruitmentQuery } from './get-partyRecruitment.query';
import { PartyRecruitmentEntity } from 'src/party/infra/db/entity/apply/party_recruitment.entity';
import { PartyUserEntity } from 'src/party/infra/db/entity/party/party_user.entity';

@QueryHandler(GetPartyRecruitmentQuery)
export class GetPartyRecruitmentHandler implements IQueryHandler<GetPartyRecruitmentQuery> {
  constructor(
    @InjectRepository(PartyRecruitmentEntity) private partyRecruitmentRepository: Repository<PartyRecruitmentEntity>,
    @InjectRepository(PartyUserEntity) private partyUser: Repository<PartyUserEntity>,
  ) {}

  async execute(query: GetPartyRecruitmentQuery) {
    const { userId, partyRecruitmentId } = query;

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
        'partyRecruitments.createdAt',
      ])
      .where('partyRecruitments.id = :id', { id: partyRecruitmentId });

    const partyRecruitment = await partyQuery.getOne();
    const partyId = partyRecruitment.party.id;
    const partyStatus = partyRecruitment.party.status;

    if (!partyRecruitment) {
      throw new NotFoundException('파티 모집이 존재하지 않습니다', 'PARTY_RECRUITMENT_NOT_EXIST');
    }

    let isJoined = false;
    if (userId) {
      isJoined = !!(await this.partyUser
        .createQueryBuilder('partyUser')
        .where('partyUser.userId = :userId', { userId })
        .andWhere('partyUser.partyId = :partyId', { partyId })
        .getOne());
    }
    partyRecruitment['isJoined'] = isJoined;

    if (partyStatus === 'deleted') {
      partyRecruitment.party['tag'] = '삭제';
    } else if (partyStatus === 'archived') {
      partyRecruitment.party['tag'] = '종료';
    } else if (partyStatus === 'active') {
      partyRecruitment.party['tag'] = '진행중';
    }

    return partyRecruitment;
  }
}
