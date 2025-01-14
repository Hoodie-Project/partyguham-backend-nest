import { DataSource, In, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BannerWebEntity } from '../entity/banner_web.entity';

@Injectable()
export class BannerWebRepository {
  constructor(
    readonly dataSource: DataSource,
    @InjectRepository(BannerWebEntity)
    private positionRepository: Repository<BannerWebEntity>,
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
