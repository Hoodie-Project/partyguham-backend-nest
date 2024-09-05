import { NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { PartyEntity } from 'src/party/infra/db/entity/party/party.entity';

import { Repository } from 'typeorm';
import { GetPartyUserQuery } from './get-partyUser.query';

@QueryHandler(GetPartyUserQuery)
export class GetPartyUserHandler implements IQueryHandler<GetPartyUserQuery> {
  constructor(@InjectRepository(PartyEntity) private partyRepository: Repository<PartyEntity>) {}

  async execute(query: GetPartyUserQuery) {
    const { partyId, sort, order, main } = query;
    console.log(main);

    const partyQuery = this.partyRepository
      .createQueryBuilder('party')
      .leftJoinAndSelect('party.partyUser', 'partyUser') // partyUser 조인
      .leftJoinAndSelect('partyUser.position', 'position') // partyUser 조인
      .leftJoin('partyUser.user', 'user') // user 정보를 조인하고 선택
      .select([
        'party.id',
        'party.title',
        'partyUser.authority',
        'user.id',
        'user.nickname',
        'user.image',
        'position.main',
        'position.sub',
      ])
      .where('party.id = :id', { id: partyId })
      .orderBy(
        `CASE 
        WHEN partyUser.authority = 'master' THEN 1
        WHEN partyUser.authority = 'deputy' THEN 2
        WHEN partyUser.authority = 'member' THEN 3
        ELSE 4 
    END`,
      )
      .addOrderBy(
        `CASE 
        WHEN position.main = '기획자' THEN 1
        WHEN position.main = '디자이너' THEN 2
        WHEN position.main = '개발자' THEN 3
        WHEN position.main = '마케터/광고' THEN 4
        ELSE 5 
    END`,
      )
      .addOrderBy(`partyUser.${sort}`, order);

    // 직군 선택 옵션
    if (main !== undefined && main !== null) {
      partyQuery.andWhere('position.main = :main', { main });
    }

    const party = await partyQuery.getOne();

    if (!party) {
      throw new NotFoundException('파티를 찾을 수 없습니다.', 'PARTY_NOT_EXIST');
    }

    return party;
  }
}
