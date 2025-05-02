import * as admin from 'firebase-admin';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as path from 'path';
import { FcmTokenRepository } from './repository/fcm-token.repository';
import { FcmTokenEntity } from './entity/fcm-token.entity';

@Injectable()
export class FcmService {
  constructor(private readonly fcmTokenRepository: FcmTokenRepository) {
    const keyPath = process.env.FIREBASE_KEY_PATH; // 필수값(프로젝트설정-서비스계정)
    const serviceAccount = require(path.resolve(keyPath));
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  }

  /**
   * 토큰 등록
   */
  async registerFcmToken(userId: number, token: string, device: string) {
    try {
      return await this.fcmTokenRepository.upsertToken(token, userId, device);
    } catch (err) {
      throw new InternalServerErrorException('FCM 토큰 저장 실패');
    }
  }

  /**
   * 토큰으로 조회
   */
  async getFcmToken(token: string): Promise<FcmTokenEntity | undefined> {
    return this.fcmTokenRepository.findByToken(token);
  }

  /**
   * 유저의 활성 토큰 목록 조회
   */
  async getActiveFcmTokens(userId: number): Promise<FcmTokenEntity[]> {
    return this.fcmTokenRepository.findActiveTokensByUserId(userId);
  }

  /**
   * 토큰 비활성화
   */
  async deactivateFcmToken(token: string): Promise<void> {
    await this.fcmTokenRepository.deactivateToken(token);
  }

  /**
   * 유저의 모든 토큰 비활성화
   */
  async deactivateAllFcmTokens(userId: number): Promise<void> {
    await this.fcmTokenRepository.deactivateAllTokensByUserId(userId);
  }

  /**
   * 메세지(notification) 형식 알림 보내기
   */
  async sendMessagePushNotification(token: string, title: string, body: string) {
    const message = {
      token,
      notification: {
        title,
        body,
      },
    };

    try {
      const response = await admin.messaging().send(message);
      console.log('✅ FCM 전송 성공:', response);
      return response;
    } catch (error) {
      console.error('❌ FCM 전송 실패:', {
        name: error.name,
        message: error.message,
        code: error.code,
        details: error.details,
        stack: error.stack,
      });
      throw error;
    }
  }

  /**
   * data 형식 알림 보내기
   */
  async sendDataPushNotificationByUserId(userId: number, title: string, body: string, type: string) {
    const userFcm = await this.fcmTokenRepository.findOneActiveTokenByUserId(userId);

    if (userFcm) {
      const token = userFcm.token;

      try {
        const message = {
          token,
          data: {
            title,
            body,
            type,
          },
        };

        const response = await admin.messaging().send(message);
        console.log('✅ FCM 전송 성공:', response);
        return response;
      } catch (error) {
        console.error('❌ FCM 전송 실패:', error);
        throw error;
      }
    } else {
      console.error('❌ FCM 토큰 조회 되지 않음');
    }
  }

  async sendDataPushNotification(token: string, title: string, body: string, type: string) {
    const message = {
      token,
      data: {
        title,
        body,
        type,
      },
    };

    try {
      const response = await admin.messaging().send(message);
      console.log('✅ FCM 전송 성공:', response);
      return response;
    } catch (error) {
      console.error('❌ FCM 전송 실패:', error);
      throw error;
    }
  }
}
