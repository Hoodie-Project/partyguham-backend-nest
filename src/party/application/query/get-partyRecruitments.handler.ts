import { NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { GetPartyRecruitmentsQuery } from './get-partyRecruitments.query';

import { PartyEntity } from 'src/party/infra/db/entity/party/party.entity';
import { PartyRecruitmentEntity } from 'src/party/infra/db/entity/apply/party_recruitment.entity';

@QueryHandler(GetPartyRecruitmentsQuery)
export class GetPartyRecruitmentsHandler implements IQueryHandler<GetPartyRecruitmentsQuery> {
  constructor(
    @InjectRepository(PartyEntity) private partyRepository: Repository<PartyEntity>,
    @InjectRepository(PartyRecruitmentEntity) private partyRecruitmentRepository: Repository<PartyRecruitmentEntity>,
  ) {}

  async execute(query: GetPartyRecruitmentsQuery) {
    const { partyId, sort, order, main } = query;

    const party = await this.partyRepository
      .createQueryBuilder('party')
      .where('party.id = :id', { id: partyId })
      .getOne();

    if (!party) {
      throw new NotFoundException('파티가 존재하지 않습니다', 'PARTY_NOT_EXIST');
    }

    const partyRecruitmentQuery = this.partyRecruitmentRepository
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
      partyRecruitmentQuery.andWhere('position.main = :main', { main });
    }

    const partyRecruitments = await partyRecruitmentQuery.getMany();

    return partyRecruitments;
  }
}
