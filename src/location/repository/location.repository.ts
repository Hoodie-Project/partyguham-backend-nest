import { DataSource, In, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { LocationEntity } from '../entity/location.entity';

@Injectable()
export class LocationRepository {
  constructor(
    readonly dataSource: DataSource,
    @InjectRepository(LocationEntity)
    private locationRepository: Repository<LocationEntity>,
  ) {}

  async findByIds(ids: number[]) {
    const result = await this.locationRepository.find({ where: { id: In(ids) } });

    return result;
  }

  async findAll() {
    const result = await this.locationRepository.find();

    return result;
  }

  async findByProvince(province: string) {
    const result = await this.locationRepository.find({ where: { province }, order: { id: 'ASC' } });

    return result;
  }
}
