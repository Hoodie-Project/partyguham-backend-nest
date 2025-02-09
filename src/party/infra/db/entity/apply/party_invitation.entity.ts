import { UserEntity } from 'src/user/infra/db/entity/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { PartyRecruitmentEntity } from './party_recruitment.entity';
import { BaseEntity } from 'src/common/entity/baseEntity';

@Entity('party_invitation')
export class PartyInvitationEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  partyRecruitmentId: number;

  @Column({ nullable: true })
  message: string;

  @ManyToOne(() => UserEntity, (user) => user.partyInvitations)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ManyToOne(() => PartyRecruitmentEntity, (partyRecruitment) => partyRecruitment.partyInvitaions, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'party_recruitment_id' })
  partyRecruitment: PartyRecruitmentEntity;
}
