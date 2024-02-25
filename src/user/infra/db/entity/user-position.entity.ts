import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column, Unique } from 'typeorm';
import { UserEntity } from './user.entity';
import { PositionEntity } from 'src/position/entity/position.entity';

@Entity('user_position')
export class UserPositionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  positionId: number;

  @ManyToOne(() => UserEntity, (user) => user.userSkills)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ManyToOne(() => PositionEntity, (position) => position.userPositions)
  @JoinColumn({ name: 'position_id' })
  position: PositionEntity;
}
