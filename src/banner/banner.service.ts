import { Injectable } from '@nestjs/common';
import { BannerRepository } from './repository/banner.repository';

@Injectable()
export class BannerService {
  constructor(private bannerRepository: BannerRepository) {}

  async create(title: string, image: string) {
    const result = await this.bannerRepository.create(title, image);

    return result;
  }

  async findAll() {
    const result = await this.bannerRepository.findAllAndCount();

    return result;
  }

  async delete(id: number) {
    await this.bannerRepository.delete(id);
  }
}
