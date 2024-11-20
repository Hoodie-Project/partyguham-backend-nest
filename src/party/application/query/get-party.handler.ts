import { NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { PartyEntity } from 'src/party/infra/db/entity/party/party.entity';

import { Repository } from 'typeorm';
import { GetPartyQuery } from './get-party.query';

@QueryHandler(GetPartyQuery)
export class GetPartyHandler implements IQueryHandler<GetPartyQuery> {
  constructor(@InjectRepository(PartyEntity) private partyRepository: Repository<PartyEntity>) {}

  async execute(query: GetPartyQuery) {
    const { partyId } = query;

    const partyQuery = this.partyRepository
      .createQueryBuilder('party')
      .leftJoinAndSelect('party.partyType', 'partyType') // partyType을 전체 선택
      .leftJoinAndSelect('party.partyUser', 'partyUser') // partyUser을 전체 선택
      .leftJoinAndSelect('party.partyRecruitments', 'partyRecruitments') // partyRecruitments를 전체 선택
      .select([
        'party', // party 테이블의 모든 컬럼 선택
        'partyUser',
        'partyType', // partyType 테이블의 모든 컬럼 선택
        'partyRecruitments', // partyRecruitments 테이블의 모든 컬럼 선택
      ])
      .where('party.id = :id', { id: partyId });

    const party = await partyQuery.getOne();

    if (!party || party.status === 'deleted') {
      throw new NotFoundException('파티를 찾을 수 없습니다.', 'PARTY_NOT_EXIST');
    }

    if (party.status === 'archived') {
      party['tag'] = '종료';
    } else if (party.status === 'active') {
      party['tag'] = '진행중';
    }

    return party;
  }
}
