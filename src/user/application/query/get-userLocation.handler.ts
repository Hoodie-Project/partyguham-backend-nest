import { NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserLocationEntity } from 'src/user/infra/db/entity/user_location.entity';
import { GetUserLocationQuery } from './get-userLocation.query';

@QueryHandler(GetUserLocationQuery)
export class GetUserLocationHandler implements IQueryHandler<GetUserLocationQuery> {
  constructor(@InjectRepository(UserLocationEntity) private userLocationRepository: Repository<UserLocationEntity>) {}

  async execute(query: GetUserLocationQuery) {
    const { userId } = query;

    const user = await this.userLocationRepository
      .createQueryBuilder('userLocation')
      .leftJoin('userLocation.location', 'location')
      .select(['userLocation', 'location.id'])
      .where('userLocation.userId = :userId', { userId })
      .getMany();

    console.log('user', user);

    if (!user) {
      throw new NotFoundException('경력 데이터가 존재하지 않습니다.', 'USER_NOT_FOUND');
    }
    return user;
  }
}
