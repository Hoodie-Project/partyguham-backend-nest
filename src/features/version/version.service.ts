import { Injectable } from '@nestjs/common';

import { VersionRepository } from './repository/version.repository';

@Injectable()
export class VersionService {
  constructor(private readonly versionRepo: VersionRepository) {}

  getLatestVersion(platform: string) {
    return this.versionRepo.findLatestByPlatform(platform);
  }
}
