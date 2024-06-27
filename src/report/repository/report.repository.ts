import { DataSource, In, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ReportEntity } from '../entity/report.entity';

@Injectable()
export class ReportRepository {
  constructor(
    readonly dataSource: DataSource,
    @InjectRepository(ReportEntity)
    private positionRepository: Repository<ReportEntity>,
  ) {}

  async create(type: string, typeId: number, content: string) {
    const result = await this.positionRepository.save({ type, typeId, content });

    return result;
  }

  async findAll() {
    const result = await this.positionRepository.find();

    return result;
  }

  async findById(id: number) {
    const result = await this.positionRepository.find({ where: { id } });

    return result;
  }

  async findByIds(ids: number[]) {
    const result = await this.positionRepository.find({ where: { id: In(ids) } });

    return result;
  }
}
