import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { FollowEntity } from 'src/user/infra/db/entity/follow.entity';

import { UserEntity } from 'src/user/infra/db/entity/user.entity';
import { Repository } from 'typeorm';
import { GetFollowQuery } from './get-follow.query';

@QueryHandler(GetFollowQuery)
export class GetFollowHandler implements IQueryHandler<GetFollowQuery> {
  constructor(
    @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
    @InjectRepository(FollowEntity) private followRepository: Repository<FollowEntity>,
  ) {}

  async execute(query: GetFollowQuery) {
    const { userId, page, limit, sort, order } = query;
    const offset = (page - 1) * limit || 0;

    const followUsersQueryBuilder = this.followRepository
      .createQueryBuilder('follow')
      .leftJoinAndSelect(`follow.${sort}`, `${sort}`)
      .select([`${sort}.nickname AS nickname`, `${sort}.image AS image`])
      .limit(limit)
      .offset(offset)
      .orderBy(`follow.createdAt`, order)
      .where(sort === 'follower' ? `follow.followId = :followId` : `follow.userId = :userId`, {
        followId: userId,
        userId,
      });

    const followCountsQueryBuilder = this.followRepository
      .createQueryBuilder('follow')
      .select([
        'COUNT(CASE WHEN follow.followId = :followId THEN 1 END) AS followerCount',
        'COUNT(CASE WHEN follow.userId = :userId THEN 1 END) AS followingCount',
      ])
      .setParameters({ followId: userId, userId });

    const [counts, user] = await Promise.all([
      followCountsQueryBuilder.getRawOne(),
      followUsersQueryBuilder.getRawMany(),
    ]);

    return { counts, user };
  }
}
