import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { PartyUserEntity } from './party_user.entity';
import { PartyInvitationEntity } from '../apply/party_invitation.entity';
import { PartyApplicationEntity } from '../apply/party_application.entity';
import { BaseEntity } from 'src/common/entity/baseEntity';

@Entity('party')
export class PartyEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  partyStatus: string;

  @Column({ nullable: true })
  projectStatus: string;

  @Column({ nullable: true })
  title: string;

  @Column({ nullable: true })
  content: string;

  @OneToMany(() => PartyUserEntity, (partyUser) => partyUser.party)
  partyUser: PartyUserEntity[];

  @OneToMany(() => PartyApplicationEntity, (partyApplication) => partyApplication.party)
  partyApplications: PartyApplicationEntity[];

  @OneToMany(() => PartyInvitationEntity, (partyInvitationEntity) => partyInvitationEntity.party)
  partyInvitations: PartyInvitationEntity[];
}
