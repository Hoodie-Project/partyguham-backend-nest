import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entity/user.entity';

import { UserFactory } from 'src/user/domain/user/user.factory';
import { IUserRepository } from 'src/user/domain/user/repository/iuser.repository';
import { User } from 'src/user/domain/user/user';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    readonly dataSource: DataSource,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private userFactory: UserFactory,
  ) {}

  async findByAccount(account: string): Promise<User> {
    const userEntity = await this.userRepository.findOne({
      where: { account },
    });

    if (!userEntity) {
      return null;
    }

    const { id, nickname, email } = userEntity;

    return this.userFactory.reconstitute(id, account, nickname, email);
  }

  async findByNickname(nickname: string): Promise<User | null> {
    const userEntity = await this.userRepository.findOne({
      where: { nickname },
    });

    if (!userEntity) {
      return null;
    }

    const { id, account, email } = userEntity;

    return this.userFactory.reconstitute(id, account, nickname, email);
  }

  async create(account: string, nickname: string, email: string): Promise<UserEntity> {
    const result = await this.userRepository.save({ account, nickname, email });

    return result;
  }

  async update(is_party, meeting_type, meeting_week, meeting_time, mbti): Promise<void> {
    await this.dataSource.transaction(async (manager) => {
      const user = await this.userRepository.save({ is_party, meeting_type, meeting_week, meeting_time, mbti });

      await manager.save(user);
    });
  }
}
