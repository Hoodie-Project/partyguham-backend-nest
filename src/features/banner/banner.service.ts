import { Injectable } from '@nestjs/common';
import { BannerRepository } from './repository/banner.repository';
import { S3Service } from 'src/libs/aws/s3/s3.service';
import { bannerImageKey } from 'src/libs/aws/s3/key.util';

@Injectable()
export class BannerService {
  constructor(
    private bannerRepository: BannerRepository,
    private s3Service: S3Service,
  ) {}

  async createWeb(title: string, link: string, image: Express.Multer.File) {
    let key: string | undefined;

    if (image) {
      key = bannerImageKey(image.originalname);
      await this.s3Service.uploadFile(image, key);
    }

    const result = await this.bannerRepository.createWeb(title, link, image.originalname);

    return result;
  }

  async createApp(title: string, link: string, image: Express.Multer.File) {
    let key: string | undefined;

    if (image) {
      key = bannerImageKey(image.originalname);
      await this.s3Service.uploadFile(image, key);
    }

    const result = await this.bannerRepository.createApp(title, link, image.originalname);

    return result;
  }

  async findAllWeb() {
    const result = await this.bannerRepository.findAllWebAndCount();

    return result;
  }

  async findAllApp() {
    const result = await this.bannerRepository.findAllAppAndCount();

    return result;
  }

  async delete(id: number) {
    const deleteBanner = await this.bannerRepository.findById(id);

    if (deleteBanner) {
      await this.bannerRepository.delete(id);

      if (deleteBanner.image) {
        this.s3Service.deleteFile(deleteBanner.image);
      }
    }
  }
}
