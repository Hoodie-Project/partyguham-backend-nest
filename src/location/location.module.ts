import { Module } from '@nestjs/common';
import { LocationController } from './location.controller';
import { LocationService } from './location.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocationEntity } from './entity/location.entity';
import { LocationRepository } from './repository/location.repository';

@Module({
  controllers: [LocationController],
  providers: [LocationService, LocationRepository],
  imports: [TypeOrmModule.forFeature([LocationEntity])],
  exports: [LocationService],
})
export class LocationModule {}
