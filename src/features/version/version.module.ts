import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { VersionService } from './version.service';
import { VersionController } from './version.controller';
import { VersionEntity } from './entity/version.entity';
import { VersionRepository } from './repository/version.repository';

@Module({
  imports: [TypeOrmModule.forFeature([VersionEntity])],
  providers: [VersionService, VersionRepository],
  controllers: [VersionController],
})
export class VersionModule {}
