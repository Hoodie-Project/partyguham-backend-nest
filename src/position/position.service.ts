import { Injectable } from '@nestjs/common';
import { PositionRepository } from './repository/position.repository';

@Injectable()
export class PositionService {
  constructor(private positionRepository: PositionRepository) {}

  async findAll() {
    const result = await this.positionRepository.findAll();

    return result;
  }
}
