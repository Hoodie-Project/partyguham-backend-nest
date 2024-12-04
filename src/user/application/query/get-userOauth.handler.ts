import { NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';

import { UserEntity } from 'src/user/infra/db/entity/user.entity';
import { Repository } from 'typeorm';

import { PartyUserEntity } from 'src/party/infra/db/entity/party/party_user.entity';
import { GetUserOauthQuery } from './get-userOauth.query';

@QueryHandler(GetUserOauthQuery)
export class GetUserOauthHandler implements IQueryHandler<GetUserOauthQuery> {
  constructor(
    @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
    @InjectRepository(PartyUserEntity) private partyuserRepository: Repository<PartyUserEntity>,
  ) {}

  async execute(query: GetUserOauthQuery) {
    const { userId } = query;

    const user = await this.userRepository
      .createQueryBuilder('user')
      .leftJoin('user.oauths', 'oauths')
      .select(['user', 'oauths'])
      .where('user.id = :id', { id: userId })
      .getOne();

    if (!user) {
      throw new NotFoundException('유저가 존재하지 않습니다');
    }

    // 결과를 응답 형식에 맞춰 반환
    return {
      ...user,
    };
  }
}
