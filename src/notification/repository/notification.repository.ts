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

  async hasUncheckedNotifications(userId: number): Promise<boolean> {
    const notification = await this.notificationRepository.findOne({
      where: {
        userId,
        isChecked: false,
      },
    });

    return !!notification;
  }

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

  async markAsCheck(userId: number) {
    return await this.notificationRepository.update({ userId }, { isChecked: true });
  }

  async markAsRead(notificationId: number, userId: number) {
    return await this.notificationRepository.update({ id: notificationId, userId }, { isRead: true });
  }

  async create(
    userId: number,
    notificationTypeId: number,
    title: string,
    message: string,
    image: string,
    link: string,
  ) {
    return this.notificationRepository.save({ userId, notificationTypeId, title, message, image, link });
  }

  async createBulk(
    userIds: number[],
    notificationTypeId: number,
    title: string,
    message: string,
    image: string,
    link: string,
  ) {
    const notifications = userIds.map((userId) => ({
      userId,
      notificationTypeId,
      title,
      message,
      image,
      link,
    }));

    return this.notificationRepository.insert(notifications);
  }

  async deleteById(notificationId: number, userId: number): Promise<boolean> {
    const result = await this.notificationRepository.delete({ id: notificationId, userId });
    return result.affected > 0; // 삭제 성공 여부 반환
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
