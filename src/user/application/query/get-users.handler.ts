import { NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';

import { UserEntity } from 'src/user/infra/db/entity/user.entity';
import { Repository } from 'typeorm';
import { GetUsersQuery } from './get-users.query';

@QueryHandler(GetUsersQuery)
export class GetUsersHandler implements IQueryHandler<GetUsersQuery> {
  constructor(@InjectRepository(UserEntity) private userRepository: Repository<UserEntity>) {}

  async execute(query: GetUsersQuery) {
    const { page, limit, sort, order } = query;

    const offset = (page - 1) * limit || 0;
    const user = await this.userRepository
      .createQueryBuilder('user')
      .limit(limit)
      .offset(offset)
      .orderBy(`user.${sort}`, order)
      .getManyAndCount();

    if (!user) {
      throw new NotFoundException('유저가 존재하지 않습니다');
    }

    return user;
  }
}
