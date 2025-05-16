import { NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { GetPartyUserQuery } from './get-partyUser.query';
import { PartyUserEntity } from 'src/party/infra/db/entity/party/party_user.entity';
import { StatusEnum } from 'src/common/entity/baseEntity';

@QueryHandler(GetPartyUserQuery)
export class GetPartyUserHandler implements IQueryHandler<GetPartyUserQuery> {
  constructor(@InjectRepository(PartyUserEntity) private partyUserRepository: Repository<PartyUserEntity>) {}

  async execute(query: GetPartyUserQuery) {
    const { partyId, sort, order, main, nickname } = query;

    // Admin
    const partyAdmin = await this.partyUserRepository
      .createQueryBuilder('partyUser')
      .leftJoin('partyUser.party', 'party')
      .leftJoin('partyUser.position', 'position')
      .leftJoin('partyUser.user', 'user')
      .leftJoin('user.userCareers', 'userCareers')
      .select([
        'partyUser.id',
        'partyUser.authority',
        'user.nickname',
        'user.image',
        'userCareers.positionId',
        'userCareers.years',
        'position.id',
        'position.main',
        'position.sub',
      ])
      .where('partyUser.authority IN (:...authorities)', { authorities: ['master', 'deputy'] })
      .andWhere('party.id = :id', { id: partyId })
      .andWhere('party.status != :deleted', { deleted: StatusEnum.DELETED })
      .getMany();

    if (!partyAdmin) {
      throw new NotFoundException('파티를 찾을 수 없습니다.', 'PARTY_NOT_EXIST');
    }

    const partyMemberQuery = this.partyUserRepository
      .createQueryBuilder('partyUser')
      .leftJoin('partyUser.party', 'party')
      .leftJoin('partyUser.position', 'position')
      .leftJoin('partyUser.user', 'user')
      .leftJoin('user.userCareers', 'userCareers')
      .select([
        'partyUser.id',
        'partyUser.authority',
        'user.nickname',
        'user.image',
        'userCareers.positionId',
        'userCareers.years',
        'position.id',
        'position.main',
        'position.sub',
      ])
      .where('partyUser.authority = :authority', { authority: 'member' }) // 멤버만
      .andWhere('party.id = :id', { id: partyId })
      .orderBy(`partyUser.${sort}`, order);

    // 직군 선택 옵션
    if (main !== undefined && main !== null) {
      partyMemberQuery.andWhere('position.main = :main', { main });
    }

    if (nickname !== undefined && nickname !== null) {
      partyMemberQuery.andWhere('user.nickname LIKE :nickname', { nickname: `%${nickname}%` });
    }

    const partyUser = await partyMemberQuery.getMany();

    return { partyAdmin, partyUser };
  }
}
