import { DataSource, In, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BannerAppEntity } from '../entity/banner_app.entity';

@Injectable()
export class BannerAppRepository {
  constructor(
    readonly dataSource: DataSource,
    @InjectRepository(BannerAppEntity)
    private positionRepository: Repository<BannerAppEntity>,
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
