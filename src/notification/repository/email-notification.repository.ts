import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EmailNotificationEntity } from '../entity/email-notification.entity';

@Injectable()
export class EmailNotificationRepository {
  constructor(
    readonly dataSource: DataSource,
    @InjectRepository(EmailNotificationEntity)
    private emailNotificationRepository: Repository<EmailNotificationEntity>,
  ) {}

  async findByEmail(email: string): Promise<EmailNotificationEntity | null> {
    return this.emailNotificationRepository.findOne({ where: { email } });
  }

  async saveEmail(email: string) {
    return this.emailNotificationRepository.save({ email });
  }
}
