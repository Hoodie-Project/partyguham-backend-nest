import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { NotificationEntity } from './notification.entity';

@Entity('notification_type')
export class NotificationTypeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  type: string;

  @Column({ nullable: false })
  label: string;

  @OneToMany(() => NotificationEntity, (party) => party.notificationType)
  parties: NotificationEntity[];
}
