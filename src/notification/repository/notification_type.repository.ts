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
    const result = await this.notificationTypeRepository.findOne({
      where: { type },
    });

    if (!result) {
      throw new InternalServerErrorException('데이터베이스에 타입이 없음');
    }

    return result;
  }

  async findAll() {
    return await this.notificationTypeRepository.find({});
  }
}
