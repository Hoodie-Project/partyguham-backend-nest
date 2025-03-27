import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, JoinColumn } from 'typeorm';
import { NotificationTypeEntity } from './notification_type.entity';

@Entity('notification')
export class NotificationEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  notificationTypeId: number;

  @Column('varchar', { nullable: false, default: '제목' })
  title: string;

  @Column('varchar', { nullable: false, default: '메세지' })
  message: string;

  @Column('varchar', { nullable: false })
  link: string;

  @Column({ default: false })
  isRead: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => NotificationTypeEntity, (partyType) => partyType.parties, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'notification_type_id', referencedColumnName: 'id' })
  notificationType: NotificationTypeEntity;
}
