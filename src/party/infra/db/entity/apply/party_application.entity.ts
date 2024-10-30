import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';

import { UserEntity } from 'src/user/infra/db/entity/user.entity';
import { PartyRecruitmentEntity } from './party_recruitment.entity';
import { BaseEntity } from 'src/common/entity/baseEntity';

@Entity('party_application')
export class PartyApplicationEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  partyRecruitmentId: number;

  @Column({ nullable: true })
  message: string;

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
  @JoinColumn({ name: 'party_recruitment_id' })
  partyRecruitment: PartyRecruitmentEntity;
}
