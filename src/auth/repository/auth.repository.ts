import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { AuthEntity } from '../entity/auth.entity';

@Injectable()
export class AuthRepository {
  constructor(
    readonly dataSource: DataSource,
    @InjectRepository(AuthEntity)
    private authRepository: Repository<AuthEntity>,
  ) {}

  async findByAccount(userId: number) {
    const result = await this.authRepository.findOne({
      where: { userId },
    });

    return result;
  }

  async findRefreshToken(userId: number, refreshToken: string) {
    const result = this.authRepository.findOne({ where: { userId, refreshToken } });

    return result;
  }

  async saveRefreshToken(userId: number, refreshToken: string) {
    const result = await this.authRepository.save({ userId, refreshToken });

    return result;
  }
}
