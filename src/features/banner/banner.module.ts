import { Module } from '@nestjs/common';
import { BannerController } from './banner.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BannerService } from './banner.service';
import { BannerRepository } from './repository/banner.repository';
import { BannerEntity } from './entity/banner.entity';
import { ImageModule } from 'src/libs/image/image.module';
import { AwsModule } from 'src/libs/aws/s3/s3.module';

@Module({
  controllers: [BannerController],
  providers: [BannerService, BannerRepository],
  imports: [AwsModule, ImageModule.register('banner'), TypeOrmModule.forFeature([BannerEntity])],
})
export class BannerModule {}
