import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { IUserLocationRepository } from 'src/user/domain/user/repository/iuserLocation.repository';
import { UserLocationEntity } from '../entity/user_location.entity';

@Injectable()
export class UserLocationRepository implements IUserLocationRepository {
  constructor(
    readonly dataSource: DataSource,
    @InjectRepository(UserLocationEntity)
    private userLocationRepository: Repository<UserLocationEntity>,
  ) {}

  async findById(id: number) {
    const result = await this.userLocationRepository.findOne({ where: { id } });

    return result;
  }

  async findByUserId(userId: number) {
    const result = await this.userLocationRepository.find({ where: { userId } });

    return result;
  }

  async bulkInsert(userId: number, locationIds: number[]) {
    const userLocations = locationIds.map((locationId) => ({ userId, locationId }));

    const result = await this.userLocationRepository.save(userLocations);

    return result;
  }

  async bulkUpdate(update: { id: number; userId: number; locationId: number }[]) {
    const result = await this.userLocationRepository.save(update);

    return result;
  }

  async deleteById(id: number) {
    const result = await this.userLocationRepository.delete({ id });

    return result.affected ? true : false;
  }

  async deleteByUserId(userId: number) {
    const result = await this.userLocationRepository.delete({ userId });

    return result.affected ? true : false;
  }
}
