import { NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';

import { UserEntity } from 'src/user/infra/db/entity/user.entity';
import { Repository } from 'typeorm';

import { GetUserCarrerQuery } from './get-userCarrer.query';
import { UserCareerEntity } from 'src/user/infra/db/entity/user_career.entity';

@QueryHandler(GetUserCarrerQuery)
export class GetUserCarrerHandler implements IQueryHandler<GetUserCarrerQuery> {
  constructor(@InjectRepository(UserCareerEntity) private userRepository: Repository<UserCareerEntity>) {}

  async execute(query: GetUserCarrerQuery) {
    const { userId } = query;

    const user = await this.userRepository
      .createQueryBuilder('userCarrer')
      .leftJoin('userCarrer.position', 'position')
      .select(['userCarrer', 'position'])
      .where('userCarrer.userId = :userId', { userId })
      .getMany();

    if (!user) {
      throw new NotFoundException('경력 데이터가 존재하지 않습니다.', 'USER_NOT_FOUND');
    }
    return user;
  }
}
