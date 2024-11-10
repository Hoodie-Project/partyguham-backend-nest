import { DataSource, In, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BannerEntity } from '../entity/banner.entity';

@Injectable()
export class BannerRepository {
  constructor(
    readonly dataSource: DataSource,
    @InjectRepository(BannerEntity)
    private positionRepository: Repository<BannerEntity>,
  ) {}

  async create(title: string, image: string) {
    const result = await this.positionRepository.save({ title, image });

    return result;
  }

  async findAllAndCount() {
    const result = await this.positionRepository.findAndCount();

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

  async delete(id: number) {
    await this.positionRepository.delete({ id });
  }
}
