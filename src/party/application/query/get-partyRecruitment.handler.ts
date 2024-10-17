import { NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { GetPartyRecruitmentQuery } from './get-partyRecruitment.query';
import { PartyRecruitmentEntity } from 'src/party/infra/db/entity/apply/party_recruitment.entity';

@QueryHandler(GetPartyRecruitmentQuery)
export class GetPartyRecruitmentHandler implements IQueryHandler<GetPartyRecruitmentQuery> {
  constructor(
    @InjectRepository(PartyRecruitmentEntity) private partyRecruitmentRepository: Repository<PartyRecruitmentEntity>,
  ) {}

  async execute(query: GetPartyRecruitmentQuery) {
    const { partyRecruitmentId } = query;

    const partyQuery = this.partyRecruitmentRepository
      .createQueryBuilder('partyRecruitments')
      .leftJoin('partyRecruitments.party', 'party')
      .leftJoin('partyRecruitments.position', 'position')
      .leftJoin('partyRecruitments.partyApplications', 'partyApplications')
      .leftJoinAndSelect('party.partyType', 'partyType')
      .select([
        'party.title AS title',
        'party.image AS image',
        'partyType.type AS "partyType"',
        'position.id AS "positionId"',
        'position.main AS main',
        'position.sub AS sub',
        'partyRecruitments.content AS content',
        'partyRecruitments.recruitingCount AS "recruitingCount"',
        'partyRecruitments.recruitedCount AS "recruitedCount"',
        'partyRecruitments.createdAt AS "createdAt"',
      ])
      .addSelect('COUNT(partyApplications.id)', 'applicationCount') // partyApplications의 개수를 추가
      .where('partyRecruitments.id = :id', { id: partyRecruitmentId })
      .groupBy('party.id')
      .addGroupBy('partyRecruitments.id')
      .addGroupBy('position.id')
      .addGroupBy('partyType.id');

    const party = await partyQuery.getRawOne();

    if (!party) {
      throw new NotFoundException('파티 모집이 존재하지 않습니다', 'PARTY_RECRUITMENT_NOT_EXIST');
    }

    if (party.status === 'deleted') {
      party['tag'] = '삭제';
    } else if (party.status === 'archived') {
      party['tag'] = '종료';
    } else if (party.status === 'active') {
      party['tag'] = '진행중';
    }

    return party;
  }
}
