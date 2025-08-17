import { DataSource, Repository } from 'typeorm';
import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { NotificationTypeEntity } from '../entity/notification_type.entity';

@Injectable()
export class NotificationTypeRepository {
  constructor(
    readonly dataSource: DataSource,
    @InjectRepository(NotificationTypeEntity)
    private notificationTypeRepository: Repository<NotificationTypeEntity>,
  ) {}

  async findOne(type: string) {
    return this.notificationTypeRepository.findOne({
      where: { type },
    });
  }

  async findAll() {
    return await this.notificationTypeRepository.find({});
  }
}
