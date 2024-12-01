import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { PartyEntity } from 'src/party/infra/db/entity/party/party.entity';
import { GetSearchQuery } from './get-search.query';
import { PartyRecruitmentEntity } from 'src/party/infra/db/entity/apply/party_recruitment.entity';
import { StatusEnum } from 'src/common/entity/baseEntity';

@QueryHandler(GetSearchQuery)
export class GetSearchHandler implements IQueryHandler<GetSearchQuery> {
  constructor(
    @InjectRepository(PartyEntity) private partyRepository: Repository<PartyEntity>,
    @InjectRepository(PartyRecruitmentEntity) private partyrecruitmentRepository: Repository<PartyRecruitmentEntity>,
  ) {}

  async execute(query: GetSearchQuery) {
    const { page, limit, titleSearch } = query;

    const offset = (page - 1) * limit || 0;
    const partiesQuery = this.partyRepository
      .createQueryBuilder('party')
      .leftJoinAndSelect('party.partyType', 'partyType')
      .loadRelationCountAndMap('party.recruitmentCount', 'party.partyRecruitments')
      .limit(limit)
      .offset(offset)
      .orderBy(`party.createdAt`, 'DESC')
      .where('party.title LIKE :title', { title: `%${titleSearch}%` })
      .andWhere('party.status = :status', { status: StatusEnum.ACTIVE })
      .andWhere('party.status = :status', { status: StatusEnum.ARCHIVED });

    const parties = await partiesQuery.getManyAndCount();

    parties[0].forEach((party) => {
      if (party.status === 'archived') {
        party['tag'] = '종료';
      } else if (party.status === 'active') {
        party['tag'] = '진행중';
      }
    });

    const recruitmentsQuery = this.partyrecruitmentRepository
      .createQueryBuilder('partyRecruitments')
      .leftJoin('partyRecruitments.party', 'party')
      .leftJoin('party.partyType', 'partyType')
      .leftJoin('partyRecruitments.position', 'position')
      .select(['partyRecruitments', 'party.id', 'party.title', 'party.image', 'partyType', 'position'])
      .limit(limit)
      .offset(offset)
      .orderBy(`partyRecruitments.createdAt`, 'DESC')
      .where('party.title LIKE :title', { title: `%${titleSearch}%` })
      .andWhere('partyRecruitments.status = :status', { status: StatusEnum.ACTIVE });

    const partyRecruitments = await recruitmentsQuery.getManyAndCount();

    return {
      party: { total: parties[1], parties: parties[0] },
      partyRecruitment: { total: partyRecruitments[1], partyRecruitments: partyRecruitments[0] },
    };
  }
}
