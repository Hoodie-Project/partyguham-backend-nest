import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';

import { UserEntity } from 'src/user/infra/db/entity/user.entity';
import { PartyRecruitmentEntity } from './party_recruitment.entity';

@Entity('party_application')
export class PartyApplicationEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  message: string;

  @Column({ nullable: true, type: 'date' })
  created_at: Date;

  @ManyToOne(() => UserEntity, (user) => user.partyApplication, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ManyToOne(() => PartyRecruitmentEntity, (partyRecruitment) => partyRecruitment.partyApplications, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'party_id' })
  partyRecruitment: PartyRecruitmentEntity;
}
