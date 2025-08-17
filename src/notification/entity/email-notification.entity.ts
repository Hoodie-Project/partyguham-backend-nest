import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('email_notification')
export class EmailNotificationEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { default: null })
  email: string;

  @CreateDateColumn()
  createdAt: Date;
}
