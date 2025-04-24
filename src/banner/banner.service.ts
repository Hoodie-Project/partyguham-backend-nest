import { Injectable } from '@nestjs/common';
import { BannerRepository } from './repository/banner.repository';
import { ImageService } from 'src/libs/image/image.service';

@Injectable()
export class BannerService {
  constructor(
    private bannerRepository: BannerRepository,
    private imageService: ImageService,
  ) {}

  async createWeb(title: string, imagePath: string, link: string) {
    const savedImagePath = imagePath ? this.imageService.getRelativePath(imagePath) : undefined;

    const result = await this.bannerRepository.createWeb(title, savedImagePath, link);

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
