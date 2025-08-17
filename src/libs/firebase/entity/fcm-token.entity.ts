import { UserEntity } from 'src/user/infra/db/entity/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Index(['userId', 'device'], { unique: true })
@Entity('fcm_token')
export class FcmTokenEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  token: string;

  @Column({ nullable: true })
  device: string;

  @Column({ default: true })
  isActive: boolean;

  @ManyToOne(() => UserEntity, (user) => user.fcmTokens, { onDelete: 'CASCADE' })
  user: UserEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
