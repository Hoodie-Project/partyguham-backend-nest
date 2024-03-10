import { DataSource, Repository } from 'typeorm';
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

  async findAll() {
    const result = await this.locationRepository.find();

    return result;
  }
}
