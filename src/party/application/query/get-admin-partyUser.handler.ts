import { NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { GetAdminPartyUserQuery } from './get-admin-partyUser.query';
import { PartyUserEntity } from 'src/party/infra/db/entity/party/party_user.entity';

@QueryHandler(GetAdminPartyUserQuery)
export class GetAdminPartyUserHandler implements IQueryHandler<GetAdminPartyUserQuery> {
  constructor(@InjectRepository(PartyUserEntity) private partyUserRepository: Repository<PartyUserEntity>) {}

  async execute(query: GetAdminPartyUserQuery) {
    const { partyId, page, limit, sort, order, main, nickname } = query;
    const offset = (page - 1) * limit || 0;

    const partyMemberQuery = this.partyUserRepository
      .createQueryBuilder('partyUser')
      .leftJoinAndSelect('partyUser.position', 'position')
      .leftJoin('partyUser.user', 'user')
      .select([
        'partyUser.authority',
        'partyUser.createdAt',
        'partyUser.updatedAt',
        'partyUser.status',
        'user.id',
        'user.nickname',
        'user.image',
        'position.main',
        'position.sub',
      ])
      .limit(limit)
      .offset(offset)
      .andWhere('partyUser.partyId = :partyId', { partyId: partyId })
      .orderBy(`partyUser.${sort}`, order);

    // 직군 선택 옵션
    if (main !== undefined && main !== null) {
      partyMemberQuery.andWhere('position.main = :main', { main });
    }

    if (nickname !== undefined && nickname !== null) {
      partyMemberQuery.andWhere('user.nickname LIKE :nickname', { nickname: `%${nickname}%` });
    }

    const [partyUser, total] = await partyMemberQuery.getManyAndCount();

    if (!partyUser) {
      throw new NotFoundException('파티를 찾을 수 없습니다.', 'PARTY_NOT_EXIST');
    }

    return { total, partyUser };
  }
}
