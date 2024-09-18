import { NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { PartyEntity } from 'src/party/infra/db/entity/party/party.entity';

import { Repository } from 'typeorm';
import { GetPartyRecruitmentsQuery } from './get-partyRecruitments.query';

@QueryHandler(GetPartyRecruitmentsQuery)
export class GetPartyRecruitmentsHandler implements IQueryHandler<GetPartyRecruitmentsQuery> {
  constructor(@InjectRepository(PartyEntity) private partyRepository: Repository<PartyEntity>) {}

  async execute(query: GetPartyRecruitmentsQuery) {
    const { partyId, sort, order, main } = query;

    const partyQuery = this.partyRepository
      .createQueryBuilder('party')
      .leftJoin('party.partyRecruitments', 'partyRecruitments')
      .leftJoin('partyRecruitments.position', 'position')
      .leftJoin('partyRecruitments.partyApplications', 'partyApplications')
      .select([
        'position.main AS main',
        'position.sub AS sub',
        'partyRecruitments.id AS "partyRecruitmentId"',
        'partyRecruitments.content AS content',
        'partyRecruitments.recruitingCount AS "recruitingCount"',
        'partyRecruitments.recruitedCount AS "recruitedCount"',
        'partyRecruitments.createdAt AS "createdAt"',
      ])
      .addSelect('COUNT(partyApplications.id)', 'applicationCount') // partyApplications의 개수를 추가
      .where('party.id = :id', { id: partyId })
      .orderBy(`partyRecruitments.${sort}`, order)
      .groupBy('party.id')
      .addGroupBy('partyRecruitments.id')
      .addGroupBy('position.id');

    if (main !== undefined && main !== null) {
      partyQuery.andWhere('position.main = :main', { main });
    }

    const party = await partyQuery.getRawMany();

    if (!party) {
      throw new NotFoundException('파티가 존재하지 않습니다', 'PARTY_NOT_EXIST');
    }

    return party;
  }
}
