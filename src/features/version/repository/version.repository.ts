import { Repository } from 'typeorm';
import { VersionEntity } from '../entity/version.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class VersionRepository {
  constructor(
    @InjectRepository(VersionEntity)
    private versionRepository: Repository<VersionEntity>,
  ) {}

  async findLatestByPlatform(platform: string): Promise<VersionEntity | undefined> {
    return this.versionRepository.findOne({
      where: { platform },
      order: { id: 'DESC' },
    });
  }
}
