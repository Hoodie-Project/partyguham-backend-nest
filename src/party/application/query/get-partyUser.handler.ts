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
    const { partyId, sort, order, main, nickname } = query;

    // Admin
    const partyAdmin = await this.partyRepository
      .createQueryBuilder('party')
      .leftJoinAndSelect('party.partyUser', 'partyUser') // partyUser 조인
      .leftJoinAndSelect('partyUser.position', 'position') // partyUser 조인
      .leftJoin('partyUser.user', 'user') // user 정보를 조인하고 선택
      .select([
        'party.id',
        'partyUser.authority',
        'user.id',
        'user.nickname',
        'user.image',
        'position.main',
        'position.sub',
      ])
      .where('partyUser.authority IN (:...authorities)', { authorities: ['master', 'deputy'] })
      .andWhere('party.id = :id', { id: partyId })
      .getOne();

    if (!partyAdmin) {
      throw new NotFoundException('파티를 찾을 수 없습니다.', 'PARTY_NOT_EXIST');
    }

    const partyMemberQuery = this.partyRepository
      .createQueryBuilder('party')
      .leftJoinAndSelect('party.partyUser', 'partyUser') // partyUser 조인
      .leftJoinAndSelect('partyUser.position', 'position') // partyUser 조인
      .leftJoin('partyUser.user', 'user') // user 정보를 조인하고 선택
      .select([
        'party.id',
        'partyUser.authority',
        'user.id',
        'user.nickname',
        'user.image',
        'position.main',
        'position.sub',
      ])
      .where('partyUser.authority = :authority', { authority: 'member' }) // 멤버만
      .andWhere('party.id = :id', { id: partyId })
      .orderBy(`partyUser.${sort}`, order);
    //   .addOrderBy(
    //     `CASE
    //     WHEN position.main = '기획자' THEN 1
    //     WHEN position.main = '디자이너' THEN 2
    //     WHEN position.main = '개발자' THEN 3
    //     WHEN position.main = '마케터/광고' THEN 4
    //     ELSE 5
    // END`,
    //   )

    // 직군 선택 옵션
    if (main !== undefined && main !== null) {
      partyMemberQuery.andWhere('position.main = :main', { main });
    }

    if (nickname !== undefined && nickname !== null) {
      partyMemberQuery.andWhere('user.nickname LIKE :nickname', { nickname: `%${nickname}%` });
    }

    const partyUser = await partyMemberQuery.getOne();

    return { partyAdmin, partyUser };
  }
}
