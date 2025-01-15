import { Injectable } from '@nestjs/common';
import { BannerRepository } from './repository/banner.repository';

@Injectable()
export class BannerService {
  constructor(private bannerRepository: BannerRepository) {}

  async createWeb(title: string, image: string, link: string) {
    const result = await this.bannerRepository.createWeb(title, image, link);

    return result;
  }

  async findAllWeb() {
    const result = await this.bannerRepository.findAllWebAndCount();

    return result;
  }

  async createApp(title: string, image: string, link: string) {
    const result = await this.bannerRepository.createApp(title, image, link);

    return result;
  }

  async findAllApp() {
    const result = await this.bannerRepository.findAllAppAndCount();

    return result;
  }

  async delete(id: number) {
    await this.bannerRepository.delete(id);
  }
}
