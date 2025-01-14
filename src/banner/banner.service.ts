import { Injectable } from '@nestjs/common';
import { BannerWebRepository } from './repository/banner_web.repository';
import { BannerAppRepository } from './repository/banner_app.repository';

@Injectable()
export class BannerService {
  constructor(
    private bannerWebRepository: BannerWebRepository,
    private bannerAppRepository: BannerAppRepository,
  ) {}

  async create(title: string, image: string) {
    const result = await this.bannerWebRepository.create(title, image);

    return result;
  }

  async findAll() {
    const result = await this.bannerWebRepository.findAllAndCount();

    return result;
  }

  async delete(id: number) {
    await this.bannerWebRepository.delete(id);
  }
}
