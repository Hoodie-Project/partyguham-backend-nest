import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  Unique,
  CreateDateColumn,
} from 'typeorm';

import { PartyEntity } from '../party/party.entity';
import { PositionEntity } from 'src/position/entity/position.entity';
import { PartyApplicationEntity } from './party_application.entity';
import { PartyInvitationEntity } from './party_invitation.entity';
import { BaseEntity } from 'src/common/entity/baseEntity';

@Entity('party_recruitment')
@Unique(['partyId', 'positionId'])
export class PartyRecruitmentEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  partyId: number;

  @Column()
  positionId: number;

  @Column('smallint', { default: 1 })
  recruitingCount: number; // 모집중 인원

  @Column('smallint', { default: 0 })
  recruitedCount: number; // 모집된 인원

  @Column('text', { nullable: true })
  content: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => PartyApplicationEntity, (partyApplication) => partyApplication.partyRecruitment)
  partyApplications: PartyApplicationEntity[];

  @OneToMany(() => PartyInvitationEntity, (partyApplication) => partyApplication.partyRecruitment)
  partyInvitaions: PartyInvitationEntity[];

  @ManyToOne(() => PositionEntity, (position) => position.partyRecruitments, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'position_id', referencedColumnName: 'id' })
  position: PositionEntity;

  @ManyToOne(() => PartyEntity, (party) => party.partyRecruitments, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'party_id' })
  party: PartyEntity;
}
