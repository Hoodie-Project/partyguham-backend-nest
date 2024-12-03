import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { GetMyPartyApplicationsQuery } from './get-myPartyApplications.query';
import { PartyApplicationEntity } from 'src/party/infra/db/entity/apply/party_application.entity';

@QueryHandler(GetMyPartyApplicationsQuery)
export class GetMyPartyApplicationHandler implements IQueryHandler<GetMyPartyApplicationsQuery> {
  constructor(
    @InjectRepository(PartyApplicationEntity) private partyApplicationRepository: Repository<PartyApplicationEntity>,
  ) {}

  async execute(query: GetMyPartyApplicationsQuery) {
    const { userId, page, limit, sort, order } = query;

    //내가 속한 파티
    const offset = (page - 1) * limit || 0;
    const [partyApplications, total] = await this.partyApplicationRepository
      .createQueryBuilder('partyApplication')
      .leftJoin('partyApplication.partyRecruitment', 'partyRecruitment')
      .leftJoin('partyRecruitment.position', 'position')
      .leftJoin('partyRecruitment.party', 'party')
      .leftJoin('party.partyType', 'partyType')
      .select([
        'partyApplication.id',
        'partyApplication.message',
        'partyApplication.status',
        'partyApplication.createdAt',
        'position.main',
        'position.sub',
        'partyRecruitment.id',
        'party.id',
        'party.title',
        'party.image',
        'party.createdAt',
        'partyType.type',
      ])
      .where('partyApplication.userId = :userId', { userId })
      .limit(limit)
      .offset(offset)
      .orderBy(`partyApplication.${sort}`, order)
      .getManyAndCount();

    // parties.forEach((party) => {
    //   if (party.status === 'archived') {
    //     party['tag'] = '종료';
    //   } else if (party.status === 'active') {
    //     party['tag'] = '진행중';
    //   }
    // });

    // 결과를 응답 형식에 맞춰 반환
    return {
      total,
      partyApplications,
    };
  }
}
