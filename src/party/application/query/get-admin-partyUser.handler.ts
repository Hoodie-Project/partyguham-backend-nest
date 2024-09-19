import { NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { PartyEntity } from 'src/party/infra/db/entity/party/party.entity';

import { Repository } from 'typeorm';
import { GetAdminPartyUserQuery } from './get-admin-partyUser.query';

@QueryHandler(GetAdminPartyUserQuery)
export class GetAdminPartyUserHandler implements IQueryHandler<GetAdminPartyUserQuery> {
  constructor(@InjectRepository(PartyEntity) private partyRepository: Repository<PartyEntity>) {}

  async execute(query: GetAdminPartyUserQuery) {
    const { partyId, sort, order, main, nickname } = query;

    const partyMemberQuery = this.partyRepository
      .createQueryBuilder('party')
      .leftJoinAndSelect('party.partyUser', 'partyUser') // partyUser 조인
      .leftJoinAndSelect('partyUser.position', 'position') // partyUser 조인
      .leftJoin('partyUser.user', 'user') // user 정보를 조인하고 선택
      .select([
        'party.id',
        'partyUser.authority',
        'partyUser.createdAt',
        'user.id',
        'user.nickname',
        'user.image',
        'position.main',
        'position.sub',
      ])
      .andWhere('party.id = :id', { id: partyId })
      .orderBy(`partyUser.${sort}`, order);

    // 직군 선택 옵션
    if (main !== undefined && main !== null) {
      partyMemberQuery.andWhere('position.main = :main', { main });
    }

    if (nickname !== undefined && nickname !== null) {
      partyMemberQuery.andWhere('user.nickname LIKE :nickname', { nickname: `%${nickname}%` });
    }

    const partyUser = await partyMemberQuery.getOne();

    if (!partyUser) {
      throw new NotFoundException('파티를 찾을 수 없습니다.', 'PARTY_NOT_EXIST');
    }

    console.log(partyUser);

    return partyUser;
  }
}
