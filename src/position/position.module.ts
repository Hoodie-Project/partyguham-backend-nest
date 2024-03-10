import { Module } from '@nestjs/common';
import { PositionController } from './position.controller';
import { PositionService } from './position.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PositionEntity } from './entity/position.entity';
import { PositionRepository } from './repository/position.repository';

@Module({
  controllers: [PositionController],
  providers: [PositionService, PositionRepository],
  imports: [TypeOrmModule.forFeature([PositionEntity])],
})
export class PositionModule {}
