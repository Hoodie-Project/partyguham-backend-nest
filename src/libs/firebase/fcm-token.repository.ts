import { Repository } from 'typeorm';
import { FcmTokenEntity } from './fcm-token.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FcmTokenRepository extends Repository<FcmTokenEntity> {
  async createTokenWithUserId(token: string, userId: number, device?: string): Promise<FcmTokenEntity> {
    const entity = this.create({
      userId,
      token,
      device,
      isActive: true,
    });

    return this.save(entity);
  }

  // 토큰으로 조회
  async findByToken(token: string): Promise<FcmTokenEntity | undefined> {
    return this.findOne({ where: { token } });
  }

  // 특정 유저의 활성 토큰 목록 조회
  async findActiveTokensByUserId(userId: number): Promise<FcmTokenEntity[]> {
    return this.find({
      where: { user: { id: userId }, isActive: true },
    });
  }

  // 비활성화 처리
  async deactivateToken(token: string): Promise<void> {
    await this.update({ token }, { isActive: false });
  }

  // 특정 유저의 모든 토큰 비활성화
  async deactivateAllTokensByUserId(userId: number): Promise<void> {
    await this.createQueryBuilder()
      .update(FcmTokenEntity)
      .set({ isActive: false })
      .where('userId = :userId', { userId })
      .execute();
  }
}
