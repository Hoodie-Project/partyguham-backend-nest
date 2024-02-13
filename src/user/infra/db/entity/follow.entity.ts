import { UserEntity } from 'src/user/infra/db/entity/user.entity';
import { Entity, ManyToOne, JoinColumn, Unique, CreateDateColumn, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('follow')
@Unique(['userId', 'followId'])
export class FollowEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  followId: number;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => UserEntity, (user) => user.followers, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  follower: UserEntity;

  @ManyToOne(() => UserEntity, (users) => users.followings, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'follow_id', referencedColumnName: 'id' })
  following: UserEntity;
}
