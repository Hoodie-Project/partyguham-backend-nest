import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PositionEntity } from '../entity/position.entity';

@Injectable()
export class PositionRepository {
  constructor(
    readonly dataSource: DataSource,
    @InjectRepository(PositionEntity)
    private positionRepository: Repository<PositionEntity>,
  ) {}

  async findAll() {
    const result = await this.positionRepository.find();

    return result;
  }
}
