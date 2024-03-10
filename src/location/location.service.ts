import { Injectable } from '@nestjs/common';
import { LocationRepository } from './repository/location.repository';

@Injectable()
export class LocationService {
  constructor(private locationRepository: LocationRepository) {}

  async findAll() {
    const result = await this.locationRepository.findAll();

    return result;
  }
}
