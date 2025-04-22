import * as admin from 'firebase-admin';
import { Injectable } from '@nestjs/common';
import * as path from 'path';

@Injectable()
export class FirebaseService {
  constructor() {
    try {
      const keyPath = process.env.FIREBASE_KEY_PATH || 'src/common/firebase/firebase-service-account.prod.json';
      const serviceAccount = require(path.resolve(keyPath));
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });

      console.log('✅ Firebase Admin SDK 초기화 성공');
    } catch (err) {
      console.error('❌ Firebase 초기화 실패:', err);
    }
  }

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

  async sendDataPushNotification(token: string, title: string, body: string) {
    const message = {
      token,
      data: {
        title,
        body,
        type: 'custom',
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
