import { DataSource, In, LessThan, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Notification } from '../entity/notification.entity';

@Injectable()
export class NotificationRepository {
  constructor(
    readonly dataSource: DataSource,
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
  ) {}

  async getNotifications(userId: number, limit: number, cursor?: number) {
    const whereCondition = cursor ? { userId, id: LessThan(cursor) } : { userId };

    const notifications = await this.notificationRepository.find({
      where: whereCondition,
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
