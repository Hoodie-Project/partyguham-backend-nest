import { DataSource, In, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BannerEntity, BannerPlatformEnum } from '../entity/banner.entity';

@Injectable()
export class BannerRepository {
  constructor(
    readonly dataSource: DataSource,
    @InjectRepository(BannerEntity)
    private positionRepository: Repository<BannerEntity>,
  ) {}

  async createWeb(title: string, image: string, link: string) {
    const result = await this.positionRepository.save({ platform: BannerPlatformEnum.Web, title, image, link });

    return result;
  }

  async createApp(title: string, image: string, link: string) {
    const result = await this.positionRepository.save({ platform: BannerPlatformEnum.App, title, image, link });

    return result;
  }

  async findAllWebAndCount() {
    const result = await this.positionRepository.findAndCount({ where: { platform: BannerPlatformEnum.Web } });

    return result;
  }

  async findAllAppAndCount() {
    const result = await this.positionRepository.findAndCount({ where: { platform: BannerPlatformEnum.App } });

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
