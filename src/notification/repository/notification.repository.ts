import { DataSource, LessThan, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NotificationEntity } from '../entity/notification.entity';

@Injectable()
export class NotificationRepository {
  constructor(
    readonly dataSource: DataSource,
    @InjectRepository(NotificationEntity)
    private notificationRepository: Repository<NotificationEntity>,
  ) {}

  async getNotifications(userId: number, limit: number, cursor?: number, notificationTypeId?: number) {
    const whereCondition = cursor
      ? { userId, notificationTypeId, id: LessThan(cursor) }
      : { userId, notificationTypeId };

    const notifications = await this.notificationRepository.find({
      where: [whereCondition],
      relations: ['notificationType'],
      order: { id: 'DESC' },
      take: limit,
    });

    return {
      notifications,
      nextCursor: notifications.length > 0 ? notifications[notifications.length - 1].id : null,
    };
  }

  async findOne(notificationId: number) {
    return this.notificationRepository.findOne({ where: { id: notificationId } });
  }

  async markAsRead(notificationId: number, userId: number) {
    return await this.notificationRepository.update({ id: notificationId, userId }, { isRead: true });
  }

  async create(userId: number, notificationTypeId: number, message: string, link: string) {
    return this.notificationRepository.create({ userId, notificationTypeId, message, link });
  }

  async createBulk(userIds: number[], notificationId: number, message: string, link: string) {
    const notifications = userIds.map((userId) => ({
      userId,
      notificationId,
      message,
      link,
    }));

    return this.notificationRepository.insert(notifications);
  }

  /**
   * 사용자의 모든 알람을 읽음 처리
   */
  // async markAllAsRead(userId: number): Promise<void> {
  //   await this.createQueryBuilder()
  //     .update(Notification)
  //     .set({ isRead: true })
  //     .where('userId = :userId AND isRead = false', { userId })
  //     .execute();
  // }
}
