import { ForbiddenException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { NotificationRepository } from './repository/notification.repository';
import { NotificationTypeRepository } from './repository/notification_type.repository';

@Injectable()
export class NotificationService {
  constructor(
    private notificationRepository: NotificationRepository,
    private notificationTypeRepository: NotificationTypeRepository,
  ) {}

  async getNotifications(userId: number, limit: number, cursor?: number, type?: string) {
    let notificationTypeId: number;
    if (type) {
      notificationTypeId = (await this.notificationTypeRepository.findOne(type)).id;
    }

    return await this.notificationRepository.getNotifications(userId, limit, cursor, notificationTypeId);
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

  async createNotification(userId: number, type: string, title: string, message: string, image: string, link: string) {
    const notificationType = await this.notificationTypeRepository.findOne(type);

    return await this.notificationRepository.create(userId, notificationType.id, title, message, image, link);
  }

  async createNotifications(
    userIds: number[],
    type: string,
    title: string,
    message: string,
    image: string,
    link: string,
  ) {
    const notificationType = await this.notificationTypeRepository.findOne(type);

    return await this.notificationRepository.createBulk(userIds, notificationType.id, title, message, image, link);
  }

  async deleteNotification(userId: number, notificationId: number): Promise<void> {
    const notification = await this.notificationRepository.findOne(notificationId);

    if (!notification) {
      throw new NotFoundException('알람이 없습니다');
    }

    if (notification.userId !== userId) {
      throw new ForbiddenException('권한이 없습니다.');
    }

    const result = await this.notificationRepository.deleteById(notificationId, userId);

    if (!result) {
      throw new InternalServerErrorException('삭제 실패');
    }
  }
}
