import { Injectable } from '@nestjs/common';
import { NotificationRepository } from './repository/notification.repository';

@Injectable()
export class NotificationService {
  constructor(private notificationRepository: NotificationRepository) {}
  async createNotification() {}

  async getNotifications(userId: number, limit: number, cursor?: number) {
    return await this.notificationRepository.getNotifications(userId, limit, cursor);
  }
}
