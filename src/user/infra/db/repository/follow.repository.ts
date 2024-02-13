import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { IFollowRepository } from 'src/user/domain/follow/repository/iFollow.repository';
import { FollowEntity } from '../entity/follow.entity';
import { Follow } from 'src/user/domain/follow/follow';
import { FollowFactory } from 'src/user/domain/follow/follow.factory';

@Injectable()
export class FollowRepository implements IFollowRepository {
  constructor(
    readonly dataSource: DataSource,
    @InjectRepository(FollowEntity)
    private followRepository: Repository<FollowEntity>,
    private followFactory: FollowFactory,
  ) {}

  async create(userId: number, followId: number): Promise<Follow> {
    await this.followRepository.save({ userId, followId });

    return this.followFactory.reconstitute(userId, followId);
  }

  async delete(userId: number, followId: number): Promise<boolean> {
    const result = await this.followRepository.delete({ userId, followId });

    return result.affected ? true : false;
  }
}
