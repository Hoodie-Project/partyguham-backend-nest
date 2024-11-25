import { NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { GetPartyRecruitmentsQuery } from './get-partyRecruitments.query';
import { PartyRecruitmentEntity } from 'src/party/infra/db/entity/apply/party_recruitment.entity';

@QueryHandler(GetPartyRecruitmentsQuery)
export class GetPartyRecruitmentsHandler implements IQueryHandler<GetPartyRecruitmentsQuery> {
  constructor(
    @InjectRepository(PartyRecruitmentEntity) private partyRecruitmentRepository: Repository<PartyRecruitmentEntity>,
  ) {}

  async execute(query: GetPartyRecruitmentsQuery) {
    const { partyId, sort, order, main } = query;

    const partyQuery = this.partyRecruitmentRepository
      .createQueryBuilder('partyRecruitments')
      .leftJoin('partyRecruitments.position', 'position')
      .select([
        'position.main',
        'position.sub',
        'partyRecruitments.id',
        'partyRecruitments.content',
        'partyRecruitments.recruitingCount',
        'partyRecruitments.recruitedCount',
        'partyRecruitments.createdAt',
      ])
      .loadRelationCountAndMap('partyRecruitments.applicationCount', 'partyRecruitments.partyApplications')
      .where('partyRecruitments.partyId = :partyId', { partyId })
      .orderBy(`partyRecruitments.${sort}`, order);

    if (main !== undefined && main !== null) {
      partyQuery.andWhere('position.main = :main', { main });
    }

    const party = await partyQuery.getMany();

    if (!party) {
      throw new NotFoundException('파티가 존재하지 않습니다', 'PARTY_NOT_EXIST');
    }

    return party;
  }
}
