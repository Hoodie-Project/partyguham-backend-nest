import { PositionEntity } from 'src/position/entity/position.entity';
import { UserEntity } from 'src/user/infra/db/entity/user.entity';
import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column } from 'typeorm';
import { PartyEntity } from './party.entity';
import { BaseEntity } from 'src/common/entity/baseEntity';

export enum PartyAuthority {
  MASTER = 'master', // 파티장
  DEPUTY = 'deputy', // 부파티장
  MEMBER = 'member', // 맴버
}

@Entity('party_user')
export class PartyUserEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  partyId: number;

  @Column()
  positionId: number;

  @Column({ type: 'enum', enum: PartyAuthority })
  authority: string;

  @ManyToOne(() => UserEntity, (user) => user.partyUsers, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: UserEntity;

  @ManyToOne(() => PartyEntity, (party) => party.partyUsers, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'party_id', referencedColumnName: 'id' })
  party: PartyEntity;

  @ManyToOne(() => PositionEntity, (position) => position.partyUsers, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'position_id', referencedColumnName: 'id' })
  position: PositionEntity;
}
