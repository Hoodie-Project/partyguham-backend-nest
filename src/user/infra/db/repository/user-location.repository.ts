import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { IUserLocationRepository } from 'src/user/domain/user/repository/iuserLocation.repository';
import { UserLocationEntity } from '../entity/user-location.entity';

@Injectable()
export class UserLocationRepository implements IUserLocationRepository {
  constructor(
    readonly dataSource: DataSource,
    @InjectRepository(UserLocationEntity)
    private userLocationRepository: Repository<UserLocationEntity>,
  ) {}

  async findByUserId(userId: number) {
    const result = await this.userLocationRepository.find({ where: { userId } });

    return result;
  }

  async bulkInsert(userId: number, locationIds: number[]) {
    const userLocations = locationIds.map((locationId) => ({ userId, locationId }));

    const result = await this.userLocationRepository.save(userLocations);
    //save 말고 insert 쓰는 이유..?
  }
}
