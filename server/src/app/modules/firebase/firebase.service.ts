import { Injectable, Logger } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { ServiceAccount } from 'firebase-admin';

@Injectable()
export class FirebaseService {
  private readonly logger = new Logger(FirebaseService.name);

  constructor() {
    const serviceAccount: ServiceAccount = {
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    };

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  }

  async sendNotification(token: string, payload: { notification: { title: string, body: string }, data?: any }) {
    try {
      const result = await admin.messaging().send({
        token,
        notification: payload?.notification,
        data: payload?.data
      });
      this.logger.log(`Notification sent successfully: ${JSON.stringify(result)}`);
      return result;
    } catch (error) {
      this.logger.error('Error sending notification:', error);
      throw error;
    }
  }
}
