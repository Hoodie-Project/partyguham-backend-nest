import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { NotificationRepository } from './repository/notification.repository';

@Injectable()
export class NotificationService {
  constructor(private notificationRepository: NotificationRepository) {}

  async getNotifications(userId: number, limit: number, cursor?: number) {
    return await this.notificationRepository.getNotifications(userId, limit, cursor);
  }

  async markAsRead(userId: number, notificationId: number): Promise<void> {
    const notification = await this.notificationRepository.findOne(notificationId);

    if (!notification) {
      throw new NotFoundException('알람이 없습니다');
    }

    if (notification.userId !== userId) {
      throw new ForbiddenException('권한이 없습니다.');
    }

    await this.notificationRepository.markAsRead(notificationId, userId);
  }

  async createNotification(userId: number, type: string, message: string, link: string) {
    return await this.notificationRepository.create(userId, type, message, link);
  }

  async createNotifications(userIds: number[], type: string, message: string, link: string) {
    return await this.notificationRepository.createBulk(userIds, type, message, link);
  }
}
