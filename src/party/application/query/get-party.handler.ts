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

    const party = await this.partyRepository
      .createQueryBuilder('party')
      .leftJoinAndSelect('party.partyType', 'partyType') // partyType을 전체 선택
      .leftJoinAndSelect('party.partyRecruitments', 'partyRecruitments') // partyRecruitments를 전체 선택
      .leftJoin('party.partyUser', 'partyUser') // partyUser 조인
      .leftJoin('partyUser.user', 'user') // user 정보를 조인하고 선택
      .select([
        'party', // party 테이블의 모든 컬럼 선택
        'partyType', // partyType 테이블의 모든 컬럼 선택
        'partyRecruitments', // partyRecruitments 테이블의 모든 컬럼 선택
      ])
      .addSelect(['partyUser.authority', 'user.id', 'user.nickname', 'user.image'])
      .where('party.id = :id', { id: partyId })
      .getOne();

    console.log(party);
    if (!party) {
      throw new NotFoundException('파티가 존재하지 않습니다');
    }

    if (party.status === 'deleted') {
      party['tag'] = '파티 종료';
    } else if (party.partyRecruitments.length === 0) {
      party['tag'] = '진행중';
    } else {
      party['tag'] = '모집중';
    }

    return party;
  }
}
