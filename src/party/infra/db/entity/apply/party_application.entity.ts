import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';

import { UserEntity } from 'src/user/infra/db/entity/user.entity';
import { PartyRecruitmentEntity } from './party_recruitment.entity';

@Entity('party_application')
export class PartyApplicationEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  partyRecruitmentId: number;

  @Column({ nullable: true })
  message: string;

  @CreateDateColumn()
  createdAt: Date;

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
