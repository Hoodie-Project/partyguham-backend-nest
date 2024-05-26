import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';

import { PartyEntity } from '../party/party.entity';
import { PositionEntity } from 'src/position/entity/position.entity';

@Entity('party_recruitment')
export class PartyRecruitmentEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  partyId: number;

  @Column()
  positionId: number;

  @Column({ nullable: true })
  message: string;

  @Column({ nullable: true, type: 'date' })
  created_at: Date;

  @Column({ nullable: true })
  status: string;

  @ManyToOne(() => PositionEntity, (position) => position.partyRecruitments, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'position_id', referencedColumnName: 'id' })
  position: PositionEntity;

  @ManyToOne(() => PartyEntity, (post) => post.partyApplications, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'party_id' })
  party: PartyEntity;
}
