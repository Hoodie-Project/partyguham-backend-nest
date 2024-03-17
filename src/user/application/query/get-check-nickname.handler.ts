import { ConflictException, NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';

import { UserEntity } from 'src/user/infra/db/entity/user.entity';
import { Repository } from 'typeorm';
import { GetCheckNicknameQuery } from './get-check-nickname.query';

@QueryHandler(GetCheckNicknameQuery)
export class GetCheckNicknameHandler implements IQueryHandler<GetCheckNicknameQuery> {
  constructor(@InjectRepository(UserEntity) private userRepository: Repository<UserEntity>) {}

  async execute(query: GetCheckNicknameQuery) {
    const { nickname } = query;

    const user = await this.userRepository.findOne({
      where: { nickname },
    });

    if (user) {
      throw new ConflictException('중복된 닉네임 입니다.');
    }
  }
}
