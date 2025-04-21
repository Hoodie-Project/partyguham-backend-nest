import * as admin from 'firebase-admin';
import { Injectable } from '@nestjs/common';
import * as path from 'path';

@Injectable()
export class FirebaseService {
  constructor() {
    const keyPath = process.env.FIREBASE_KEY_PATH || 'src/common/firebase/firebase-service-account.dev.json';
    const serviceAccount = require(path.resolve(keyPath));
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    });
  }

  async sendPushNotification(token: string, title: string, body: string) {
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
}
