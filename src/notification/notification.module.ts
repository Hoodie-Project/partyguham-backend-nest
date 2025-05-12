import { Module } from '@nestjs/common';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationEntity } from './entity/notification.entity';
import { NotificationRepository } from './repository/notification.repository';
import { NotificationTypeRepository } from './repository/notification_type.repository';
import { NotificationTypeEntity } from './entity/notification_type.entity';
import { EmailNotificationRepository } from './repository/email-notification.repository';
import { EmailNotificationEntity } from './entity/email-notification.entity';

@Module({
  controllers: [NotificationController],
  providers: [NotificationService, NotificationRepository, NotificationTypeRepository, EmailNotificationRepository],
  imports: [TypeOrmModule.forFeature([NotificationEntity, NotificationTypeEntity, EmailNotificationEntity])],
  exports: [NotificationService],
})
export class NotificationModule {}
