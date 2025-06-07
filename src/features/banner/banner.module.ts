import { Module } from '@nestjs/common';
import { BannerController } from './banner.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BannerService } from './banner.service';
import { BannerRepository } from './repository/banner.repository';
import { BannerEntity } from './entity/banner.entity';

@Module({
  controllers: [BannerController],
  providers: [BannerService, BannerRepository],
  imports: [
    // ImageModule.register('banner'),
    TypeOrmModule.forFeature([BannerEntity]),
  ],
})
export class BannerModule {}
