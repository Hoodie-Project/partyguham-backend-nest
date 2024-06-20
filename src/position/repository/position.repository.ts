import { DataSource, In, Repository } from 'typeorm';
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

  async findById(id: number) {
    const result = await this.positionRepository.find({ where: { id } });

    return result;
  }

  async findByMain(main: string) {
    const result = await this.positionRepository.find({ where: { main }, order: { id: 'ASC' } });

    return result;
  }

  async findByIds(ids: number[]) {
    const result = await this.positionRepository.find({ where: { id: In(ids) } });

    return result;
  }
}
