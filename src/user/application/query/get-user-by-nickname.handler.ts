import { NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';

import { UserEntity } from 'src/user/infra/db/entity/user.entity';
import { Not, Repository } from 'typeorm';

import { UserByNicknameQuery } from './get-user-by-nickname.query';
import { StatusEnum } from 'src/common/entity/baseEntity';

@QueryHandler(UserByNicknameQuery)
export class UserByNicknameHandler implements IQueryHandler<UserByNicknameQuery> {
  constructor(@InjectRepository(UserEntity) private userRepository: Repository<UserEntity>) {}

  async execute(query: UserByNicknameQuery) {
    const { nickname } = query;

    const user = await this.userRepository.findOne({
      where: { nickname, status: Not(StatusEnum.DELETED) },
    });

    if (!user) {
      throw new NotFoundException('유저가 존재하지 않습니다');
    }

    return user;
  }
}
