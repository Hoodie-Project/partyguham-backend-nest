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
}
