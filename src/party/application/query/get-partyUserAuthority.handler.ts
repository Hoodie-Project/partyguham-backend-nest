import { ForbiddenException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { GetPartyUserAuthorityQuery } from './get-partyUserAuthority.query';
import { PartyUserEntity } from 'src/party/infra/db/entity/party/party_user.entity';

@QueryHandler(GetPartyUserAuthorityQuery)
export class GetPartyUserAuthorityHandler implements IQueryHandler<GetPartyUserAuthorityQuery> {
  constructor(@InjectRepository(PartyUserEntity) private partyUserRepository: Repository<PartyUserEntity>) {}

  async execute(query: GetPartyUserAuthorityQuery) {
    const { partyId, userId } = query;

    const partyUser = await this.partyUserRepository
      .createQueryBuilder('partyUser')
      .select(['partyUser.authority', 'partyUser.userId'])
      .where('partyUser.userId = :userId', { userId })
      .andWhere('partyUser.partyId = :partyId', { partyId })
      .getOne();

    if (!partyUser) {
      throw new ForbiddenException('파티에 속한 유저를 찾을 수 없습니다.', 'PARTY_USER_NOT_EXIST');
    }

    return partyUser;
  }
}
