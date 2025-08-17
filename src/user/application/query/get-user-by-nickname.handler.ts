import { NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';

import { UserEntity } from 'src/user/infra/db/entity/user.entity';
import { Not, Repository } from 'typeorm';

import { UserByNicknameQuery } from './get-user-by-nickname.query';
import { StatusEnum } from 'src/common/entity/baseEntity';
import { PartyEntity } from 'src/party/infra/db/entity/party/party.entity';

@QueryHandler(UserByNicknameQuery)
export class GetUserByNicknameHandler implements IQueryHandler<UserByNicknameQuery> {
  constructor(
    @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
    @InjectRepository(PartyEntity) private partyRepository: Repository<PartyEntity>,
  ) {}

  async execute(query: UserByNicknameQuery) {
    const { nickname } = query;

    const user = await this.userRepository
      .createQueryBuilder('user')
      .leftJoin('user.userPersonalities', 'userPersonality')
      .leftJoin('userPersonality.personalityOption', 'personalityOption')
      .leftJoin('personalityOption.personalityQuestion', 'personalityQuestion')
      .leftJoin('user.userCareers', 'userCareers')
      .leftJoin('userCareers.position', 'position')
      .leftJoin('user.userLocations', 'userLocations')
      .leftJoin('userLocations.location', 'location')
      .select([
        'user',
        'userPersonality.id',
        'personalityOption.id',
        'personalityOption.content',
        'personalityQuestion',
        'userCareers.id',
        'userCareers.years',
        'userCareers.careerType',
        'position',
        'userLocations.id',
        'location',
      ])
      .where('user.nickname = :nickname', { nickname })
      .andWhere('user.status != :deleted', { deleted: StatusEnum.DELETED })
      .getOne();

    if (!user) {
      throw new NotFoundException('유저가 존재하지 않습니다');
    }

    // const userId = user.id;
    // const party = await this.partyRepository
    //   .createQueryBuilder('party')
    //   .leftJoin('party.partyUsers', 'partyUsers')
    //   .select(['party', 'partyUsers'])
    //   .where('partyUsers.userId = :userId', { userId })
    //   .andWhere('partyUsers.status = :status', { status: StatusEnum.ACTIVE })
    //   .getOne();

    return user;
  }
}
