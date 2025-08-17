import { NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { GetUserCareerQuery } from './get-userCareer.query';
import { UserCareerEntity } from 'src/user/infra/db/entity/user_career.entity';

@QueryHandler(GetUserCareerQuery)
export class GetUserCareerHandler implements IQueryHandler<GetUserCareerQuery> {
  constructor(@InjectRepository(UserCareerEntity) private userRepository: Repository<UserCareerEntity>) {}

  async execute(query: GetUserCareerQuery) {
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
