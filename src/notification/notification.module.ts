import { Module } from '@nestjs/common';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationEntity } from './entity/notification.entity';
import { NotificationRepository } from './repository/notification.repository';
import { NotificationTypeRepository } from './repository/notification_type.repository';
import { NotificationTypeEntity } from './entity/notification_type.entity';

@Module({
  controllers: [NotificationController],
  providers: [NotificationService, NotificationRepository, NotificationTypeRepository],
  imports: [TypeOrmModule.forFeature([NotificationEntity, NotificationTypeEntity])],
  exports: [NotificationService],
})
export class NotificationModule {}
