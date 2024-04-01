import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column, Unique } from 'typeorm';
import { UserEntity } from './user.entity';
import { PositionEntity } from 'src/position/entity/position.entity';

export enum CareerTypeEnum {
  PRIMARY = 'primary',
  SECONDARY = 'secondary',
  OTHER = 'other',
}

@Entity('user_career')
export class UserCareerEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  positionId: number;

  @Column()
  years: number;

  @Column('enum', {
    enum: CareerTypeEnum,
    nullable: false,
  })
  careerType: CareerTypeEnum;

  @ManyToOne(() => UserEntity, (user) => user.userCareers)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ManyToOne(() => PositionEntity, (position) => position.userPositions)
  @JoinColumn({ name: 'position_id' })
  position: PositionEntity;
}
