import { Repository } from 'typeorm';
import { FcmTokenEntity } from '../entity/fcm-token.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class FcmTokenRepository {
  constructor(
    @InjectRepository(FcmTokenEntity)
    private readonly fcmTokenRepository: Repository<FcmTokenEntity>, // Repository 주입
  ) {}

  async createTokenWithUserId(token: string, userId: number, device?: string): Promise<FcmTokenEntity> {
    const entity = this.fcmTokenRepository.create({
      userId,
      token,
      device,
      isActive: true,
    });

    return this.fcmTokenRepository.save(entity);
  }

  async upsertToken(token: string, userId: number, device: string) {
    return this.fcmTokenRepository.upsert(
      { userId, token, device, isActive: true },
      ['userId', 'device'], // 고유 조건 (unique constraint나 복합 PK 등)
    );
  }

  // 토큰으로 조회
  async findByToken(token: string): Promise<FcmTokenEntity | undefined> {
    return this.fcmTokenRepository.findOne({ where: { token } });
  }

  async findByUserIdAndDevice(userId: number, device: string): Promise<FcmTokenEntity | null> {
    return this.fcmTokenRepository.findOne({
      where: { userId, device },
    });
  }

  // 특정 유저의 활성 토큰 목록 조회
  async findActiveTokensByUserId(userId: number): Promise<FcmTokenEntity[]> {
    return this.fcmTokenRepository.find({
      where: { user: { id: userId }, isActive: true },
    });
  }

  // 비활성화 처리
  async deactivateToken(token: string): Promise<void> {
    await this.fcmTokenRepository.update({ token }, { isActive: false });
  }

  // 특정 유저의 모든 토큰 비활성화
  async deactivateAllTokensByUserId(userId: number): Promise<void> {
    await this.fcmTokenRepository
      .createQueryBuilder()
      .update(FcmTokenEntity)
      .set({ isActive: false })
      .where('userId = :userId', { userId })
      .execute();
  }
}
