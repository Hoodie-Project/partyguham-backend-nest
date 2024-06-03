import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { PartyUserEntity } from './party_user.entity';
import { PartyInvitationEntity } from '../apply/party_invitation.entity';
import { PartyApplicationEntity } from '../apply/party_application.entity';
import { BaseEntity } from 'src/common/entity/baseEntity';
import { PartyTypeEntity } from './party_type.entity';

@Entity('party')
export class PartyEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  partyTypeId: number;

  @Column({ nullable: true })
  title: string;

  @Column('text', { nullable: true })
  content: string;

  @Column({ default: null })
  image: string;

  @Column({ default: null })
  link: string;

  @ManyToOne(() => PartyTypeEntity, (partyType) => partyType.parties, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'party_type_id', referencedColumnName: 'id' })
  partyType: PartyTypeEntity;

  @OneToMany(() => PartyUserEntity, (partyUser) => partyUser.party)
  partyUser: PartyUserEntity[];

  @OneToMany(() => PartyApplicationEntity, (partyApplication) => partyApplication.party)
  partyApplications: PartyApplicationEntity[];

  @OneToMany(() => PartyInvitationEntity, (partyInvitationEntity) => partyInvitationEntity.party)
  partyInvitations: PartyInvitationEntity[];
}
