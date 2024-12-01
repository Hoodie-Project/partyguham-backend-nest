import { NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { GetRecruitmentsQuery } from './get-recruitments.query';
import { PartyRecruitmentEntity } from 'src/party/infra/db/entity/apply/party_recruitment.entity';

@QueryHandler(GetRecruitmentsQuery)
export class GetRecruitmentsHandler implements IQueryHandler<GetRecruitmentsQuery> {
  constructor(
    @InjectRepository(PartyRecruitmentEntity) private partyrecruitmentRepository: Repository<PartyRecruitmentEntity>,
  ) {}

  async execute(query: GetRecruitmentsQuery) {
    const { page, limit, sort, order, main, positionIds, partyTypeIds, titleSearch } = query;

    const offset = (page - 1) * limit || 0;

    const recruitmentsQuery = this.partyrecruitmentRepository
      .createQueryBuilder('partyRecruitments')
      .leftJoin('partyRecruitments.party', 'party')
      .leftJoin('party.partyType', 'partyType')
      .leftJoin('partyRecruitments.position', 'position')
      .select(['partyRecruitments', 'party.id', 'party.title', 'party.image', 'partyType', 'position'])
      .limit(limit)
      .offset(offset)
      .where('1=1')
      .orderBy(`partyRecruitments.${sort}`, order);

    if (positionIds !== undefined && positionIds.length !== 0) {
      recruitmentsQuery.andWhere('position.id IN (:...positionIds)', { positionIds }); // 배열로 받은 ids를 IN 조건에 전달
    }

    if (main && main.length > 0) {
      recruitmentsQuery.andWhere('position.main IN (:...main)', { main });
    }

    if (partyTypeIds !== undefined) {
      recruitmentsQuery.andWhere('party.partyTypeId IN (:...partyTypeIds)', { partyTypeIds });
    }

    if (titleSearch !== undefined) {
      recruitmentsQuery.andWhere('party.title LIKE :title', { title: `%${titleSearch}%` });
    }

    const [partyRecruitments, total] = await recruitmentsQuery.getManyAndCount();

    if (!partyRecruitments) {
      throw new NotFoundException('파티모집이 존재하지 않습니다', 'PARTY_RECRUITMENT_NOT_EXIST');
    }

    return { total, partyRecruitments };
  }
}
