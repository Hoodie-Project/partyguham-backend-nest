import { Inject, Injectable } from '@nestjs/common';

import { UserRepository } from '../infra/db/repository/user.repository';

@Injectable()
export class CommonUserService {
  constructor(@Inject('UserRepository') private userRepository: UserRepository) {}

  async findById(userId: number) {
    return await this.userRepository.findById(userId);
  }

  async findByExternalId(externalId: string) {
    return await this.userRepository.findByExternalId(externalId);
  }

  async findByIdWithoutDeleted(userId: number) {
    return await this.userRepository.findByIdWithoutDeleted(userId);
  }

  async findByExternalIdWithoutDeleted(externalId: string) {
    return await this.userRepository.findByExternalIdWithoutDeleted(externalId);
  }
}
